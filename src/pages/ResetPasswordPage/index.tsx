import {Button, Card, Input, Page, View} from "@components";
import {SessionService, UserService} from "@services";
import {isAxiosError} from "axios";
import {useState} from "react";
import {useNavigate, useParams} from "react-router";
import {useNotifications} from "reapop";
import {useTheme} from "styled-components";
import LoadingPage from "../LoadingPage";

function ResetPasswordPage() {
  const [verificationCode, setVerificatonCode] = useState<string>('');
  const { email } = useParams();
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();
  const theme = useTheme();
  const {notify} = useNotifications();

  function resetPassword() {
    setIsLoading(true);
    SessionService.resetPassword(email || '', verificationCode, newPassword)
      .then(() => {
        notify({
          title: 'Thành công',
          message: 'Đặt lại mật khẩu thành công',
          status: 'success'
        });
        navigate('/sign_in');
      })
      .catch((error) => {
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
      })
      .finally(() => setIsLoading(false));
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
          value={verificationCode}
          placeholder="Mã xác thực"
          onChange={(e) => setVerificatonCode(e.target.value)}
          style={{flex: 1}}
        />
      </View>

      <View horizontal style={{alignItems: 'center'}}>
        <Input
          variant="tertiary"
          type="password"
          value={newPassword}
          placeholder="Mật khẩu mới"
          onChange={(e) => setNewPassword(e.target.value)}
          style={{flex: 1}}
        />
      </View>

      <View horizontal style={{alignItems: 'center'}}>
        <Input
          variant="tertiary"
          type="password"
          value={newPasswordConfirmation}
          placeholder="Mật khẩu mới nhập lại"
          onChange={(e) => setNewPasswordConfirmation(e.target.value)}
          style={{flex: 1}}
        />
      </View>

      <Button variant="primary" onClick={resetPassword}>Xác nhận</Button>
    </Card>
  )
}

export default ResetPasswordPage;
