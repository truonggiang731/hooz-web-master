import {Button, Card, BookItem, Input, Page, Tag, Text, TextArea, View} from "@components"
import {Icon} from "@iconify/react";
import {Book, BookService} from "@services";
import {useEffect, useMemo, useState} from "react";
import InfiniteScroll from "react-infinite-scroller";
import {useInfiniteQuery, useMutation, UseMutationResult} from "react-query";
import {useNotifications} from "reapop";
import {useTheme} from "styled-components";
import Modal from 'react-modal';
import LoadingPage from "../LoadingPage";
import ErrorPage from "../ErrorPage";
import {actCUDHelper} from "@helpers";
import {useNavigate} from "react-router";

function BooksPage() {
  const [searchText, setSearchText] = useState<string>('');
  const [selectedItem, setSelectedItem] = useState<Book | undefined>();
  const [modalMode, setModalMode] = useState<'create' | 'update' | 'close'>('close');

  const theme = useTheme();
  const noti = useNotifications();
  const navigate = useNavigate();

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
      backgroundColor: theme?.colors.secondaryBackground,
      width: 600
    },
    overlay: {
      backgroundColor: `${theme?.colors.background}99`,
    }
  };

  const query = useInfiniteQuery({
    queryKey: ['admin', 'books'],
    queryFn: ({ pageParam = 1 }) => BookService.getAllAsync({page: pageParam, query: searchText}),
    getNextPageParam: (lastPage) => {
      if (lastPage.paginate.page >= lastPage.paginate.total_pages) {
        return null;
      }

      return lastPage.paginate.page + 1;
    }
  });

  const create: UseMutationResult = useMutation({
    mutationFn: () => BookService.createAsync({
      id: 0,
      name: `[Tên truyện ${new Date().getTime()}]`,
      description: '[Mô tả]',
      other_names: '[Tên khác]',
      author: '[Tên tác giả]'
    }),
    onSettled: query.refetch
  })

  const update = useMutation({
    mutationFn: () => BookService.updateAsync(selectedItem!),
    onSettled: query.refetch
  });

  const remove = useMutation({
    mutationFn: (id: number) => BookService.deleteAsync(id),
    onSettled: query.refetch
  });

  useEffect(() => {
    query.refetch();
  }, [searchText])

  const books = useMemo(() => query.data?.pages.flatMap(page => page.books), [query.data]);

  if (query.isLoading) {
    return <LoadingPage />
  }

  if (query.isError) {
    return <ErrorPage onButtonClick={query.refetch} />
  }

  return (
    <Page.Container>
      <Modal
        isOpen={modalMode !== 'close'}
        onRequestClose={() => setModalMode('close')}
        style={customStyles}
      >
        <View gap={16}>
          <View gap={8}>
            <Text variant="title">Tên</Text>
            <Input
              variant="tertiary"
              placeholder="Tên"
              value={selectedItem?.name}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, name: e.target.value})}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Tên khác</Text>
            <Input
              variant="tertiary"
              placeholder="Tên khác"
              value={selectedItem?.other_names}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, other_names: e.target.value})}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Tác giả</Text>
            <Input
              variant="tertiary"
              placeholder="Tác giả"
              value={selectedItem?.author}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, author: e.target.value})}
            />
          </View>
          <View gap={8}>
            <Text variant="title">Mô tả</Text>
            <TextArea
              variant="tertiary"
              placeholder="Mô tả"
              rows={12}
              cols={40}
              value={selectedItem?.description}
              onChange={(e) => selectedItem && setSelectedItem({...selectedItem, description: e.target.value})}
            />
          </View>
          <View horizontal gap={8}>
            <Button variant="tertiary" style={{flex: 1}} onClick={() => setModalMode('close')}>Đóng</Button>
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
          </View>
        </View>
      </Modal>
      <Page.Content gap={0}>
        <View style={{position: 'sticky', top: 0, marginTop: -8, paddingTop: 8, paddingBottom: 8, backgroundColor: theme?.colors.background}} horizontal>
          <View horizontal flex={1}>
            <Button
              variant="primary"
              style={{width: 120}}
              onClick={() => {
                setSelectedItem({
                  id: 0,
                  name: '',
                  description: '',
                  other_names: '',
                  author: ''
                });
                actCUDHelper(create, noti, 'create');
              }}
            >
              <Icon icon={'mingcute:add-line'} style={{height: 20, width: 20, color: 'inhirit'}} />
              <Text variant="inhirit" style={{marginLeft: 8}}>Thêm</Text>
            </Button>
          </View>
          <View horizontal>
            <Input
              shadowEffect
              placeholder="Tìm kiếm"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </View>
        </View>
        <InfiniteScroll
          pageStart={0}
          loadMore={() => query.fetchNextPage()}
          hasMore={query.hasNextPage}
          loader={<Text>Loading...</Text>}
          useWindow={false}
          getScrollParent={() => document.getElementById('rootScrollable')}
        >
          <View gap={8} wrap style={{justifyContent: 'center'}}>
            {books?.map((item: Book) => (
              <Card
                horizontal
                shadowEffect
                key={item.id.toString()}
                onClick={() => navigate(`/books/${item.id}`)}
              >
                <View flex={1} style={{justifyContent: 'center'}}>
                  <View horizontal gap={8}>
                    <BookItem.Image src={item.image_url} style={{borderRadius: 8}} />
                    <View flex={1} gap={4}>
                      <View horizontal gap={8} style={{alignItems: 'center'}}>
                        <Text numberOfLines={1} variant="medium-title">{item.name}</Text>
                        {!item.active &&
                          <Tag style={{gap: 8}}>
                            <Icon icon={'mingcute:eye-close-line'} style={{height: 16, width: 16, color: theme?.colors.foreground}} />
                            Đang ẩn
                          </Tag>
                        }
                        {!item.free &&
                          <Tag style={{gap: 8}}>
                            <Icon icon={'mingcute:vip-4-line'} style={{height: 16, width: 16, color: theme?.colors.foreground}} />
                            Tính phí
                          </Tag>
                        }
                      </View>
                      <View horizontal>
                        {item.other_names !== '' && <Tag numberOfLines={1}>{item.other_names}</Tag>}
                      </View>
                      <View horizontal>
                        <Tag>{item.author}</Tag>
                      </View>
                      <View horizontal gap={4}>
                        <Tag style={{gap: 8}}>
                          <Icon icon={'mingcute:heart-line'} style={{height: 16, width: 16, color: theme?.colors.foreground}} />
                          {item.favorites}
                        </Tag>
                        <Tag style={{gap: 8}}>
                          <Icon icon={'mingcute:eye-2-line'} style={{height: 16, width: 16, color: theme?.colors.foreground}} />
                          {item.views}
                        </Tag>
                      </View>
                    </View>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        </InfiniteScroll>
      </Page.Content>
    </Page.Container>
  )
}

export default BooksPage;
