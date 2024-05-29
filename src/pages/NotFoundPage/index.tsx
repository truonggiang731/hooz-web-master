import {Button, Text, View} from "@components"
import {useNavigate} from "react-router-dom";
import {useTheme} from "styled-components"

export default function NotFoundPage() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <View flex={1} centerContent>
      <View centerContent>
        <img
          src={'/icon.png'}
          style={{width: 400, height: 400}}
          onClick={() => navigate('/')}
        />
        <Text style={{fontSize: 224, fontWeight: 'bold', color: theme?.colors.themeColor}}>404</Text>
      </View>
    </View>
  )
}
