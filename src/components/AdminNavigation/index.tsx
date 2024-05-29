import {TokensHelper} from "@helpers";
import {useAppDispatch, useAppSelector, useUserProfileQuery} from "@hooks";
import {Icon} from "@iconify/react";
import {setTokens} from "@redux/sessionSlice";
import {useQueryClient} from "react-query";
import {NavLink, useNavigate} from "react-router-dom";
import styled, {useTheme} from "styled-components";
import Button from "../Button";
import Card from "../Card";
import Text from "../Text";
import View from "../View";

const Avatar = styled.img`
  height: 36px;
  width: 36px;
  border-radius: 8px;
`;

const Image = styled.img`
  max-width: 164px;
  border-radius: 8px;
`;

const SilverLink = styled.a`
  text-decoration: none;
  color: ${props => props.theme.colors.quinaryForeground};
  font-weight: bold;
`

function ControlArea() {
  const dispatch = useAppDispatch();
  const query = useUserProfileQuery();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const theme = useTheme();

  return (
    <Card ebonsaiSnippet>
      <Button ebonsai square onClick={() => {dispatch(setTokens(null)); TokensHelper.eraseTokens(); queryClient.clear();}}>
        <Icon icon={'mingcute:exit-line'} style={{color: theme?.colors.foreground, height: 24, width: 24}}/>
      </Button>
      <View style={{flex: 1}}></View>
      <Button ebonsai square onClick={() => navigate('/')}>
        <Avatar src={query.isSuccess && query.data.user.avatar_url ? query.data.user.avatar_url : theme?.assets.defaultAvatar}/>
      </Button>
    </Card>
  )
}

function NavArea() {
  const theme = useTheme();

  const navItemStyle = {
    display: 'flex',
    height: 36,
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: '1.0em',
    textDecoration: 'none',
    borderRadius: 8,
    padding: 8,
    gap: 8,
    color: theme?.colors.foreground,
    backgroundColor: theme?.colors.secondaryBackground
  }

  const navItemActiveStyle = {
    display: 'flex',
    height: 36,
    alignItems: 'center',
    justifyContent: 'flex-start',
    fontSize: '1.0em',
    textDecoration: 'none',
    borderRadius: 8,
    padding: 8,
    gap: 8,
    color: theme?.colors.themeForeground,
    backgroundColor: theme?.colors.themeBackground
  }

  return (
    <Card shadowEffect flex={1}>
      <NavLink to="/" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>
        {({isActive}) => (
          <>
            <Icon icon={isActive ? 'mingcute:profile-fill' : 'mingcute:profile-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
            <Text variant="inhirit">Hồ sơ</Text>
          </>
        )}
      </NavLink>
      <NavLink to="/categories" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>
        {({isActive}) => (
          <>
            <Icon icon={isActive ? 'mingcute:classify-fill' : 'mingcute:classify-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
            <Text variant="inhirit">Danh mục</Text>
          </>
        )}
      </NavLink>
      <NavLink to="/books" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>
        {({isActive}) => (
          <>
            <Icon icon={isActive ? 'mingcute:book-2-fill' : 'mingcute:book-2-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
            <Text variant="inhirit">Sách</Text>
          </>
        )}
      </NavLink>
      <NavLink to="/users" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>
        {({isActive}) => (
          <>
            <Icon icon={isActive ? 'mingcute:user-2-fill' : 'mingcute:user-2-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
            <Text variant="inhirit">Người dùng</Text>
          </>
        )}
      </NavLink>
      <NavLink to="/plans" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>
        {({isActive}) => (
          <>
            <Icon icon={isActive ? 'mingcute:vip-4-fill' : 'mingcute:vip-4-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
            <Text variant="inhirit">Các gói</Text>
          </>
        )}
      </NavLink>
      <NavLink to="/feedbacks" style={({isActive}) => isActive ? navItemActiveStyle : navItemStyle}>
        {({isActive}) => (
          <>
            <Icon icon={isActive ? 'mingcute:message-2-fill' : 'mingcute:message-2-line'} style={{color: 'inhirit', height: 20, width: 20}}/>
            <Text variant="inhirit">Phản hồi</Text>
          </>
        )}
      </NavLink>
    </Card>
  )
}

function AdminNavigation() {
  const theme = useTheme();

  return (
    <View flex={1} ebonsaiShelf>
      <ControlArea />
      <NavArea />
      <Card shadowEffect centerContent>
        <Text style={{fontSize: 12, textAlign: 'center', color: theme?.colors.quinaryForeground}}>
          <SilverLink href="https://github.com/duykhanhrk/hooz-web">Zeta</SilverLink> & <SilverLink href="https://github.com/duykhanhrk/hooz">Shirogane</SilverLink> Projects
        </Text>
        <Text style={{fontSize: 12, textAlign: 'center', color: theme?.colors.quinaryForeground}}>
          Được phát triển bởi <SilverLink href="https://github.com/duykhanhrk">RK</SilverLink>
        </Text>
        <Image src={'./logo.png'}/>
      </Card>
    </View>
  )
}

export default AdminNavigation;
