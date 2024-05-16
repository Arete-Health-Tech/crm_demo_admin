import useUserStore from '../../store/userStore';
import { login } from './auth';
import cookie from 'js-cookie';
import { redirect } from 'react-router-dom';

export const loginHandler = async (phone: string, password: string) => {
  try {
    const { setUser } = useUserStore.getState();
    const user = (await login(phone, password)) as any;
    cookie.set('user', JSON.stringify(user));
    setUser(user);
    return redirect('/');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
