
import {Navigate, Routes, Route} from "react-router-dom";
import {
  ErrorPage,
  LoadingPage,
  ResetPasswordPage,
  SendVerificationCodePage,
  SignInPage,
  SignUpPage,
  UserProfilePage,
  UserPage,
  CategoryPage,
  PlanPage,
  BookPage,
  BooksPage,
  FeedbackPage,
  NotFoundPage
} from '@pages';
import {useAppDispatch, useAppSelector} from "@hooks";
import {AdminNavigation, SessionLayout, Layout} from "@components";
import {matchPath, useLocation} from "react-router";
import {useEffect, useState} from "react";
import {TokensHelper} from "@helpers";
import {SessionService} from "@services";
import {setTokens} from "@redux/sessionSlice";
import {isAxiosError} from "axios";

function App() {
  const [status, setStatus] = useState<{
    isLoading: boolean;
    isError: boolean;
  }>({isLoading: true, isError: false});

  const {tokens, role} = useAppSelector(state => state.session);
  const {pathname} = useLocation();
  const dispatch = useAppDispatch();

  const isErrorPage = matchPath("/error/*", pathname);

  const trySignIn = async () => {
    setStatus({isLoading: true, isError: false});

    try {
      let _tokens = TokensHelper.getTokens();

      if (_tokens) {
        _tokens = await SessionService.refreshTokensAsync(_tokens);

        TokensHelper.setTokens(_tokens);

        dispatch(setTokens(_tokens));
      }
      setStatus({isLoading: false, isError: false});
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status == 422) {
          setStatus({isLoading: false, isError: false});
        } else {
          setStatus({isLoading: false, isError: true});
        }
      } else {
        setStatus({isLoading: false, isError: true});
      }
    }
  };

  useEffect(() => {
    trySignIn();
  }, []);


  useEffect(() => {
    document.getElementById('rootScrollable')?.scrollTo(0, 0);
  }, [pathname]);

  if (status.isLoading) {
    return (
      <Layout.AppContainer>
        <Layout.AppScalableContainer>
          <LoadingPage />
        </Layout.AppScalableContainer>
      </Layout.AppContainer>
    )
  }

  if (status.isError) {
    return (
      <Layout.AppContainer>
        <Layout.AppScalableContainer>
          <ErrorPage onButtonClick={() => trySignIn()}/>;
        </Layout.AppScalableContainer>
      </Layout.AppContainer>
    )
  }

  const isAdmin = !!tokens && role !== 0;

  return (
    <Layout.AppContainer id="rootScrollable">
      <Layout.AppScalableContainer horizontal={!isErrorPage}>
        <Layout.AppHeaderContainer hide={!!isErrorPage} horizontal scalable={!isAdmin}>
          {isAdmin ? <AdminNavigation /> : <SessionLayout.SilverSpace />}
        </Layout.AppHeaderContainer>
        <Layout.AppContentContainer horizontal={!isErrorPage} scalable={isAdmin} ebonsaiShelf={!isAdmin}>
          {!isAdmin && !isErrorPage && <SessionLayout.NavigationOrnament />}
          <Routes>
            <Route path="/" element={isAdmin ? <UserProfilePage/> : <Navigate to={'/sign_in'} />} />
            <Route path="/categories" element={isAdmin ? <CategoryPage/> : <Navigate to={'/sign_in'} />} />
            <Route path="/books" element={isAdmin ? <BooksPage/> : <Navigate to={'/sign_in'} />} />
            <Route path="/books/:id" element={isAdmin ? <BookPage/> : <Navigate to={'/sign_in'} />} />
            <Route path="/users" element={isAdmin ? <UserPage/> : <Navigate to={'/sign_in'} />} />
            <Route path="/plans" element={isAdmin ? <PlanPage/> : <Navigate to={'/sign_in'} />} />
            <Route path="/feedbacks" element={isAdmin ? <FeedbackPage/> : <Navigate to={'/sign_in'} />} />
            <Route path="/sign_in" element={isAdmin ? <Navigate to={'/'} /> : <SignInPage/>} />
            <Route path="/sign_up" element={isAdmin ? <Navigate to={'/'} /> : <SignUpPage/>} />
            <Route path="/reset_password" element={isAdmin ? <Navigate to={'/'} /> : <SendVerificationCodePage/>} />
            <Route path="/reset_password/:email" element={isAdmin ? <Navigate to={'/'} /> : <ResetPasswordPage/>} />
            <Route path="/error/404" element={<NotFoundPage />} />
            <Route path="*" element={<Navigate to={'/error/404'} />} />
          </Routes>
          {!isAdmin && !isErrorPage && <SessionLayout.ControlOrnament />}
        </Layout.AppContentContainer>
      </Layout.AppScalableContainer>
    </Layout.AppContainer>
  );
}

export default App;
