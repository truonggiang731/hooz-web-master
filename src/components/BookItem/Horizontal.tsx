import {Book} from "@services";
import {useNavigate} from "react-router";
import {Link} from "react-router-dom";
import styled from "styled-components";
import Text from "../Text";
import View from "../View";
import Image from "./Image";

interface HorizontalProps extends React.HTMLProps<HTMLDivElement> {
  _data: Book;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary';
  _size?: 'small' | 'normal' | 'medium' | 'large';
  shadowEffect?: boolean;
}

const Container = styled.div<{variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary', shadowEffect?: boolean}>`
  display: flex;
  flex-direction: row;
  padding: 8px;
  gap: 8px;
  border-radius: 8px;
  overflow: hidden;
  color: ${
    props => props.variant && props.variant === 'primary'?
      props.theme.colors.themeForeground
      : props.theme.colors.foreground
  };
  background-color: ${
    props => !props.variant || props.variant === 'secondary' ? props.theme.colors.secondaryBackground
      : props.variant === 'primary' ? props.theme.colors.themeBackground
      : props.variant === 'tertiary' ? props.theme.colors.tertiaryBackground
      : props.variant === 'quaternary' ? props.theme.colors.quaternaryBackground
      : props.variant === 'quinary' ? props.theme.colors.quinaryBackground
      : props.theme.colors.themeBackground
  };

  ${props => props.shadowEffect ?  'transition: box-shadow 0.5s;' : ''};

  &:hover {
    ${props => props.shadowEffect ?  'box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' : ''}
  }
`;

const TextContainer = styled.div<{_size?: 'small' | 'normal' | 'medium' | 'large'}>`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${props => props._size === 'small' ? '4px' : '8px'};
`;

function Horizontal(props: HorizontalProps) {
  const { _data, style } = props;
  const navigate = useNavigate();

  return (
    <Link to={`/books/${_data.id}`} style={{textDecoration: 'none'}}>
      <Container
        key={_data.id.toString()}
        style={style}
        onClick={() => navigate(`/books/${_data.id}`)}
        variant={props.variant}
        shadowEffect={props.shadowEffect}
      >
        <View centerContent>
          <Image variant={props._size} style={{borderRadius: 8}} src={_data.image_url}/>
        </View>
        <TextContainer _size={props._size}>
          <Text variant="title" numberOfLines={2}>{_data.name}</Text>
          {props._size === 'small' && <Text variant="small" numberOfLines={1}><b>Tên khác: </b>{_data.other_names}</Text>}
          {props._size === 'small' && <Text variant="small" numberOfLines={1}><b>Tác giả: </b>{_data.author}</Text>}
          {props._size !== 'small' && <Text numberOfLines={6}>{_data.description}</Text>}
        </TextContainer>
      </Container>
    </Link>
  );
}

export default Horizontal;
