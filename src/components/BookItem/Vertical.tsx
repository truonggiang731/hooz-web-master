import {Book} from "@services";
import {Link} from "react-router-dom";
import styled from "styled-components";
import Text from "../Text";
import Image from "./Image";

interface VerticalProps extends React.HTMLProps<HTMLDivElement> {
  _data: Book;
  shadowEffect?: boolean;
}

const Container = styled.div<{shadowEffect?: boolean}>`
  display: flex;
  flex-direction: column;
  background-color: ${props => props.theme.colors.secondaryBackground};
  gap: 8px;
  padding: 8px;
  border-radius: 8px;
  overflow: hidden;
  width: 241px;
  ${props => props.shadowEffect ?  'transition: box-shadow 0.5s;' : ''};
  &:hover {
    ${props => props.shadowEffect ?  'box-shadow: rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;' : ''}
  }
  @media (max-width: 720px) {
    width: 166px;
  }
`;

function Vertical(props: VerticalProps) {
  const { _data, style } = props;

  return (
    <Link key={_data.id.toString()} to={`/books/${_data.id}`} style={{textDecoration: 'none'}}>
      <Container
        shadowEffect={props.shadowEffect}
        key={_data.id.toString()}
        style={style}
      >
        <Image style={{borderRadius: 8}} variant="medium" src={_data.image_url}/>
        <Text variant="title" numberOfLines={1} style={{textAlign: 'center'}}>{_data.name}</Text>
      </Container>
    </Link>
  );
}

export default Vertical;
