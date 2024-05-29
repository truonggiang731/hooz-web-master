import {Button, Card, BookItem, Input, Page, Tag, Text, TextArea, View} from "@components";
import {useTheme} from "styled-components";
import {useNavigate} from "react-router";
import {useNotifications} from "reapop";
import {useParams} from "react-router";
import {useInfiniteQuery, useMutation, useQuery, UseQueryResult} from "react-query";
import {Category, CategoryService, Chapter, Book, BookService} from "@services";
import {useEffect, useMemo, useRef, useState} from "react";
import AvatarEditor from "react-avatar-editor";
import {isAxiosError} from "axios";
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import {actCUDHelper} from "@helpers";
import {Icon} from "@iconify/react";
import InfiniteScroll from "react-infinite-scroller";
import Modal from 'react-modal';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './style.scss';

function hexToRgb(hex: string): number[] | null {
  const regex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const shortHex = hex.replace(regex, (_, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(shortHex);
  if (!result) {
    return null;
  }
  return [
    parseInt(result[1], 16),
    parseInt(result[2], 16),
    parseInt(result[3], 16),
  ];
}

function ImageSection({query}: {query: UseQueryResult<any, any>}) {
  const [image, setImage] = useState<File>();
  const [editorOpen, setEditorOpen] = useState<boolean>(false);

  const theme = useTheme();
  const fileInput = useRef<HTMLInputElement>(null);
  const editorRef = useRef<AvatarEditor>(null);

  const {notify} = useNotifications();
  
  useEffect(() => {
    if (query.data?.user) {
      fetch(query.data.book.image_url)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          const imageFile = new File([buffer], 'image.jpg', { type: 'image/jpeg' });
          setImage(imageFile);
      });
    }
  }, [query.data])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _image = e.target.files?.[0] || null;
    if (!_image) return;
    setImage(_image);
    setEditorOpen(true);
  };
  

  const selectFile = () => {
    fileInput.current?.click();
  }

  return (
    <View gap={8}>
      {editorOpen ? 
        <View horizontal>
          <View gap={8}>
            <AvatarEditor
              ref={editorRef}
              image={image || ''}
              width={360}
              height={480}
              border={50}
              color={hexToRgb(theme!.colors.background)?.concat([0.9])} // RGBA
              scale={1}
              rotate={0}
              style={{backgroundColor: theme?.colors.background}}
            />
            <View horizontal gap={8}>
              <Button variant="tertiary" style={{flex: 1}} onClick={() => setEditorOpen(false)}>Hủy bỏ</Button>
              <Button
                variant="primary"
                onClick={() => {
                  if (editorRef.current) {
                    const canvas = editorRef.current.getImageScaledToCanvas();
                    canvas.toBlob((blob) => {
                      if (blob) {
                      const file = new File([blob], 'avatar.png', { type: 'image/png' });
                      const notification = notify({
                        title: 'Thực thi',
                        message: 'Đang tải cập nhật',
                        status: 'loading',
                        dismissible: false
                      });
                      BookService.updateImageAsync(query.data.book.id, file)
                        .then(() => {
                          query.refetch();
                          notification.title = 'Thành công'
                          notification.status = 'success';
                          notification.message = 'Cập nhật thành công';
                          notification.dismissible = true;
                          notification.dismissAfter = 3000;
                          notify(notification);
                        })
                        .catch((error) => {
                          if (isAxiosError(error) && error.response) {
                            notification.message = error.response.data.message;
                          } else {
                            notification.message = 'Có lỗi xảy ra, xin thử lại sau';
                          }

                          notification.title = 'Lỗi'
                          notification.status = 'error';
                          notification.dismissible = true;
                          notification.dismissAfter = 3000;

                          notify(notification);
                        });
                    }});
                    setEditorOpen(false);
                  }
                }}
                style={{flex: 1}}
              >Cập nhật</Button>
            </View>
          </View>
        </View>
        :
        <View horizontal>
          <View gap={8}>
            <input type="file" style={{ "display": "none" }} onChange={handleImageChange} ref={fileInput} />
            <BookItem.Image style={{borderRadius: 8}} src={query.isSuccess ? query.data.book.image_url : ''} />
            <Button variant="tertiary" onClick={selectFile}>Thay đổi</Button>
          </View>
        </View>
      }
    </View>
  )
}

function InfoSection({query}: {query: UseQueryResult<any, any>}) {
  const [book, setBook] = useState<Book | undefined>();

  const noti = useNotifications();

  const categoryQuery = useQuery({
    queryKey: ['admin', 'books', 'categories'],
    queryFn: () => CategoryService.getAllSAsync(),
  });

  useEffect(() => {
    if (query.data && query.data.book) {
      setBook({...query.data.book, category_ids: query.data.book.categories.map((item: Book) => item.id)});
    }
  }, [query.data]);

  const update = useMutation({
    mutationFn: () => BookService.updateAsync(book!),
    onSettled: query.refetch,
  })

  if (query.isLoading || categoryQuery.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage error={query.error} />
  }

  if (categoryQuery.isError) {
    return <ErrorPage error={categoryQuery.error} />
  }

  return (
        <Card shadowEffect>
        <View horizontal style={{alignItems: 'center'}}>
          <Text variant="medium-title" style={{flex: 1}}>Thông tin</Text>
          <Button
            variant="primary"
            style={{gap: 8, width: 120}}
            onClick={() => actCUDHelper(update, noti, 'update')}
          >
            <Icon icon={'mingcute:save-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
            <Text variant="inhirit">Cập nhật</Text>
          </Button>
        </View>
    <View gap={8}>
      <View gap={8}>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Tên</Text>
          <Input
            flex={1}
            variant="tertiary"
            type="text"
            value={book?.name}
            placeholder="Họ"
            onChange={(e) => book && setBook({...book, name: e.target.value})}
          />
        </View>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Tên khác</Text>
          <Input
            flex={1}
            variant="tertiary"
            type="text"
            value={book?.other_names}
            placeholder="Tên"
            onChange={(e) => book && setBook({...book, other_names: e.target.value})}
          />
        </View>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Tên tác giả</Text>
          <Input
            flex={1}
            variant="tertiary"
            type="text"
            value={book?.author}
            placeholder="Tên"
            onChange={(e) => book && setBook({...book, author: e.target.value})}
          />
        </View>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Thể loại</Text>
          <View flex={1} horizontal gap={4} wrap>
            {categoryQuery.data.categories.map((item: Category) => (
              <Tag
                variant={{ct: book?.category_ids?.includes(item.id) ? 'quinary' : 'tertiary'}}
                key={item.id}
                style={{width: 120}}
                onClick={() => book && setBook({...book, category_ids: !book?.category_ids?.includes(item.id) ? book?.category_ids?.concat([item.id]) : book?.category_ids?.filter((id) => id !== item.id)})}
              >{item.name}</Tag>
            ))}
          </View>
        </View>
        <View horizontal style={{alignItems: 'center'}}>
          <Text style={{width: 180}}>Mô tả</Text>
          <TextArea
            variant="tertiary"
            value={book?.description}
            rows={12}
            placeholder="Mô tả"
            onChange={(e) => book && setBook({...book, description: e.target.value})}
            style={{flex: 1}}
          />
        </View>
      </View>
    </View>
    </Card>
  )
}

function ActionsSection({query}: {query: UseQueryResult<any, any>}) {
  const [book, setBook] = useState<Book | undefined>();
  const [isModalOpen, setModalOpen] = useState(false);

  const noti = useNotifications();
  const navigate = useNavigate();
  const theme = useTheme();

  useEffect(() => {
    if (query.data && query.data.book) {
      setBook(query.data.book);
    }
  }, [query.data]);

  const updateActive = useMutation({
    mutationFn: (notify?: boolean) => BookService.activeAsync(book?.id || 0, !book?.active, notify),
    onSettled: query.refetch
  })

  const updateFree = useMutation({
    mutationFn: () => BookService.freeAsync(book?.id || 0, !book?.free),
    onSettled: query.refetch
  })

  const remove = useMutation({
    mutationFn: () => BookService.deleteAsync(book?.id || 0)
  })

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage error={query.error} />
  }

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: `0 solid ${theme?.colors.secondaryBackground}`,
      borderRadius: 8,
      padding: 16,
      backgroundColor: theme?.colors.secondaryBackground
    },
    overlay: {
      backgroundColor: `${theme?.colors.background}99`
    }
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => setModalOpen(false)}
        style={customStyles}
      >
        <View gap={16}>
          <View gap={8}>
            <Text variant="title">Bạn có muốn thông báo đến tất cả người dùng hay không?</Text>
          </View>
          <View horizontal gap={8}>
            <Button variant="primary" style={{gap: 8, flex: 1}} onClick={() => {
              setModalOpen(false)
              actCUDHelper(updateActive, noti, 'update', true);
            }}>
              <Text>Có</Text>
            </Button>
            <Button variant="tertiary" style={{gap: 8, flex: 1}} onClick={() => {
              setModalOpen(false)
              actCUDHelper(updateActive, noti, 'update', false);
            }}>
              <Text>Không</Text>
            </Button>
          </View>
        </View>
      </Modal>
      <View horizontal flex={1} gap={8}>
        <Button
          variant="secondary"
          shadowEffect
          style={{gap: 8, width: 120}}
          onClick={() => navigate(-1)}
        >
          <Icon icon={'mingcute:arrow-left-line'} style={{color: 'inhirit', height: 24, width: 24}}/>
          <Text variant="inhirit">Trở về</Text>
        </Button>
      </View>
      <View horizontal gap={8}>
        <Button
          shadowEffect
          variant="secondary"
          style={{gap: 8, width: 120}}
          onClick={() => {
            if (!book?.active) {
              setModalOpen(true);
            } else {
              actCUDHelper(updateActive, noti, 'update');
            }
          }}
        >
          <Icon icon={book?.active ? 'mingcute:eye-fill' : 'mingcute:eye-line'} style={{color: theme?.colors.blue, height: 20, width: 20}}/>
          <Text style={{color: book?.active ? theme?.colors.blue : theme?.colors.foreground}}>Công khai</Text>
        </Button>
        <Button
          shadowEffect
          variant="secondary"
          style={{gap: 8, width: 120}}
          onClick={() => actCUDHelper(updateFree, noti, 'update')}
        >
          <Icon icon={book?.free ? 'mingcute:bling-fill' : 'mingcute:bling-line'} style={{color: theme?.colors.green, height: 20, width: 20}}/>
          <Text style={{color: book?.free ? theme?.colors.green : theme?.colors.foreground}}>Miễn phí</Text>
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            actCUDHelper(remove, noti, 'delete').then(() => navigate(-1));
          }}
          style={{gap: 8, width: 120}}
        >
          <Icon icon={'mingcute:delete-2-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
          <Text variant="inhirit">Xóa</Text>
        </Button>
      </View>
    </>
  )
}

function ChaptersSection({book_id}: {book_id: number}) {
  const [searchText, setSearchText] = useState<string>('');
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'images' | 'close'>('close');
  const [selectedItem, setSelectedItem] = useState<Chapter>({id: 0, name: '', content: ''});
  const [insertAction, setInsertAction] = useState<{type: 'insert' | 'new' | 'replace', toIndex?: number}>({type: 'new', toIndex: 0})
  const [images, setImages] = useState<Array<File>>([]);

  const fileInput = useRef<HTMLInputElement>(null);

  const noti = useNotifications();
  const navigate = useNavigate();
  const theme = useTheme();

  const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      border: `0 solid ${theme?.colors.secondaryBackground}`,
      borderRadius: 8,
      padding: 16,
      backgroundColor: theme?.colors.secondaryBackground
    },
    overlay: {
      backgroundColor: `${theme?.colors.background}99`
    }
  };

  const query = useInfiniteQuery({
    queryKey: ['admin', book_id , 'chapters'],
    queryFn: ({ pageParam = 1 }) => BookService.getAllChaptersAsync(book_id, {page: pageParam, query: searchText}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  const create = useMutation({
    mutationFn: () => BookService.createChapterAsync(book_id, selectedItem!),
    onSettled: query.refetch
  })

  const update = useMutation({
    mutationFn: () => BookService.updateChapterAsync(book_id, selectedItem!),
    onSettled: query.refetch
  });

  const updateImages = useMutation({
    mutationFn: () => BookService.updateChapterImagesAsync(book_id, selectedItem.id || 0, images),
    onSettled: query.refetch
  });

  const remove = useMutation({
    mutationFn: (id: number) => BookService.deleteChapterAsync(book_id, id),
    onSettled: query.refetch
  });


  useEffect(() => {
    query.refetch();
  }, [searchText]);

  const chapters = useMemo(() => query.data?.pages.flatMap(page => page.chapters), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage error={query.error} />
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let file = e.target.files?.[0] || null;
    if (!file) return;
    if (insertAction.type === 'new') {
      setImages(images.concat([file]));
    } else if (insertAction.type === 'insert')  {
      images.splice(insertAction.toIndex || 0, 0, file);
      setImages(images);
    } else if (insertAction.type === 'replace') {
      images.splice(insertAction.toIndex || 0, 1, file);
      setImages(images);
    }
  };
  

  const selectFile = () => {
    fileInput.current?.click();
  }

  return (
    <View gap={8}>
      <Modal
        isOpen={modalMode === 'create' || modalMode === 'update'}
        onRequestClose={() => setModalMode('close')}
        style={customStyles}
      >
        <View gap={16}>
          <View gap={8}>
            <Text variant="title">Tên</Text>
            <Input
              variant="tertiary"
              placeholder="Tên"
              value={selectedItem.name}
              onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value})}
            />
            <Text variant="title">Nội dung</Text>
            <ReactQuill
              value={selectedItem.content}
              onChange={(value) => setSelectedItem({...selectedItem, content: value})}
            />
          </View>
          <View horizontal gap={8}>
            {modalMode === 'update' &&
            <Button
              variant="primary"
              style={{gap: 8, flex: 1}}
              onClick={() => actCUDHelper(remove, noti, 'delete', selectedItem?.id).then(() => setModalMode('close'))}
            >
              <Icon icon={'mingcute:delete-2-line'} style={{height: 20, width: 20, color: theme?.colors.themeForeground}} />
              <Text variant="inhirit">Xóa</Text>
            </Button>
            }
            <Button
              variant="primary"
              style={{flex: 1}}
              onClick={() => {
                modalMode === 'create' ?
                  actCUDHelper(create, noti, 'create').then(() => setModalMode('close'))
                :
                  actCUDHelper(update, noti, 'update').then(() => setModalMode('close'))
              }}
            >{modalMode === 'create' ? 'Tạo' : 'Cập nhật'}</Button>
            <Button variant="tertiary" style={{flex: 1}} onClick={() => setModalMode('close')}>Đóng</Button>
          </View>
        </View>
      </Modal>
      <View horizontal>
        <View horizontal flex={1}>
          <Button
            variant="tertiary"
            style={{width: 120}}
            onClick={() => {
              setSelectedItem({id: 0, name: '', content: ''});
              setModalMode('create');
            }}
          >
            <Icon icon={'mingcute:add-line'} style={{height: 20, width: 20, color: theme?.colors.foreground}} />
            <Text style={{marginLeft: 8, color: theme?.colors.foreground}}>Thêm</Text>
          </Button>
        </View>
      </View>
      <View gap={8} style={{height: 640}} scrollable>
        {chapters?.length !== 0 ?
        <InfiniteScroll
          pageStart={0}
          loadMore={() => query.fetchNextPage()}
          hasMore={query.hasNextPage}
          loader={<Text>Loading...</Text>}
          useWindow={false}
        >
          <View gap={8} wrap style={{justifyContent: 'center'}}>
            {chapters?.map((item: Chapter) => (
              <Card
                variant="tertiary"
                horizontal
                style={{height: 40}}
                onClick={() => {
                  setSelectedItem(item);
                  setModalMode('update');
                }}
              >
                <View flex={1} style={{justifyContent: 'center'}}>
                  <Text variant="title">{item.name}</Text>
                </View>
              </Card>
            ))}
          </View>
        </InfiniteScroll>
        :
        <View flex={1} centerContent>
          <Text variant="large-title" style={{color: theme?.colors.quinaryForeground}}>Không có chương nào</Text>
        </View>
        }
      </View>
    </View>
  )
}

function BookPage() {
  console.log('Hello wrold')
  const theme = useTheme();
  const {id} = useParams();

  const query = useQuery({
    queryKey: ['admin', 'book', id],
    queryFn: () => BookService.getDetailAsync(parseInt(id || '')),
    retry: 0
  });

  return (
    <Page.Container>
      <Page.Content style={{flexDirection: 'row', position: 'sticky', height: 60, top: 0, marginTop: -8, paddingTop: 8, paddingBottom: 8, backgroundColor: theme?.colors.background}}>
        <ActionsSection query={query} />
      </Page.Content>
      <Page.Content gap={16}>
        <Card shadowEffect>
          <Text variant="medium-title">Ảnh đại diện</Text>
          <ImageSection query={query} />
        </Card>
        <InfoSection query={query} />
        <Card shadowEffect>
          <Text variant="medium-title">Danh sách chương</Text>
          <ChaptersSection book_id={parseInt(id || '')} />
        </Card>
      </Page.Content>
    </Page.Container>
  )
}

export default BookPage;
