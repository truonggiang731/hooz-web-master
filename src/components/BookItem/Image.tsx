import styled from "styled-components";

const Image = styled.img<{variant?: 'normal' | 'small' | 'medium' | 'large'}>`
  object-fit: cover;
  height: ${
    props => !props.variant || props.variant === 'normal' ? '200px'
      : props.variant === 'small' ? '100px'
      : props.variant === 'medium' ? '300px'
      : props.variant === 'large' ? '400px'
      : '200px'
  };
  width: ${
    props => !props.variant || props.variant === 'normal' ? '150px'
      : props.variant === 'small' ? '75px'
      : props.variant === 'medium' ? '225px'
      : props.variant === 'large' ? '300px'
      : '150px'
  };
`;

export default Image;
