import {Button, Card, Input, View} from "@components";
import {TokensHelper} from "@helpers";
import {useAppDispatch} from "@hooks";
import {setTokens} from "@redux/sessionSlice";
import {SessionService} from "@services";
import {isAxiosError} from "axios";
import {useState} from "react";
import {useNotifications} from "reapop";
import {useTheme} from "styled-components";
import LoadingPage from "../LoadingPage";

function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const theme = useTheme();
  const {notify} = useNotifications();

  const signUp = () => {
    setIsLoading(true);
    SessionService.signUpAsync({
      email,
      password
    }).then((data) => {
      TokensHelper.setTokens(data);
      dispatch(setTokens(data));
    }).catch((error) => {
      if (isAxiosError(error) && error.response) {
        notify({
          title: 'Lỗi',
          message: error.response.data.message,
          status: 'error'
        });
      } else {
        notify({
          title: 'Lỗi',
          message: 'Có lỗi xảy ra, vui lòng thử lại sau',
          status: 'error'
        });
      }
    }).finally(() => {
      setIsLoading(false);
    });
  }

  if (isLoading) {
    return <LoadingPage />
  }

  return (
    <Card shadowEffect flex={1} style={{rowGap: 16, padding: 24, justifyContent: 'center', backgroundColor: theme?.colors.secondaryBackground}}>
      <View horizontal style={{alignItems: 'center'}}>
        <Input
          variant="tertiary"
          type="text"
          value={email}
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
          style={{flex: 1}}
        />
      </View>

      <View horizontal style={{alignItems: 'center'}}>
        <Input
          variant="tertiary"
          type="password"
          value={password}
          placeholder="Mật khẩu"
          onChange={(e) => setPassword(e.target.value)}
          style={{flex: 1}}
        />
      </View>
      <Button variant="primary" onClick={signUp}>Đăng ký</Button>
    </Card>
  )
}

export default SignUpPage;
