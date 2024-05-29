import {Book} from "@services";
import {Link} from "react-router-dom";
import styled from "styled-components";
import BackgroundImage from "../BackgroundImage";
import Text from "../Text";
import Image from "./Image";

interface SlideProps extends React.HTMLProps<HTMLDivElement> {
  _data: Book;
  shadowEffect?: boolean;
}

const SlideContainer = styled.div<{shadowEffect?: boolean}>`
  display: flex;
  gap: 8px;
  border-radius: 8px;
  overflow: hidden;
  background-color: ${props => props.theme.colors.secondaryBackground};
  gap: 8px;
  padding: 8px;


  ${props => props.shadowEffect ?  'transition: box-shadow 0.5s;' : ''};

  &:hover {
    ${props => props.shadowEffect ?  'box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' : ''}
  }
`;

const TextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

function Slide(props: SlideProps) {
  const { _data, style } = props;

  return (
    <Link to={`/books/${_data.id}`} style={{textDecoration: 'none'}}>
      <SlideContainer shadowEffect={props.shadowEffect} style={style}>
        <BackgroundImage
          style={{flex: 1, alignItems: 'center', borderRadius: 8, overflow: 'hidden'}}
          src={_data.image_url || ''}
          blur={8}
        >
          <Image style={{width: 225}} variant="medium" src={_data.image_url}/>
        </BackgroundImage>
        <TextContainer>
          <Text variant='large-title' numberOfLines={1}>{_data.name}</Text>
          <Text numberOfLines={1}><b>Tên khác: </b>{_data.other_names}</Text>
          <Text numberOfLines={1}><b>Tác giả: </b>{_data.author}</Text>
          <Text numberOfLines={5}><b>Tóm tắt: </b>{_data.description}</Text>
        </TextContainer>
      </SlideContainer>
    </Link>
  );
}

export default Slide;
