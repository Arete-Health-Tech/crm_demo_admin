import useUserStore from '../store/userStore';
import Authenticated from './routes/Authenticated';
import UnAuthenticated from './routes/UnAuthenticated';
import cookie from 'js-cookie';
import { useEffect } from 'react';
import jwtDecode from 'jwt-decode';
import { Roles } from '../constants/types';
import Support from './routes/Support';
import RepresentativeOne from './routes/RepresentativeOne';
import RepresentativeTwo from './routes/RepresentativeTwo';
import RepresentativeThree from './routes/RepresentativeThree';
import RepresentativeFour from './routes/RepresentativeFour';
import RepresentativeFive from './routes/RepresentativeFive';
import OrderList from '../screen/orders/OrderList';
import Auditor from './routes/Auditor';
import Query from './routes/Query';



const AppContainer = () => {
  const { user, setUser } = useUserStore();
  useEffect(() => {
    const userString = cookie.get('user');

    if (userString) {
      const parsedUserString = JSON.parse(userString!);
      const token = parsedUserString.access;

      const decoded: any = jwtDecode(token);
      if (decoded.exp * 1000 < Date.now()) {

        setUser(null);
      } else {
        setUser(parsedUserString);
      }
    } else {
      setUser(null);
    }
  }, [setUser]);
  if (
    user !== null &&
    (user.role === Roles.ADMIN || user.role === Roles.REPRESENTATIVE)
  ) {
    return <Authenticated />;
  } else if (user !== null && user.role === Roles.SUPPORT) {
    return <Support />;
  } else if (user !== null && user.role === Roles.REPRESENTATIVEONE) {
    return <RepresentativeOne />;
  } else if (user !== null && user.role === Roles.REPRESENTATIVETWO) {
    return <RepresentativeTwo />;
  } else if (user !== null && user.role === Roles.REPRESENTATIVETHREE) {
    return <RepresentativeThree />;
  } else if (user !== null && user.role === Roles.REPRESENTATIVEFOUR) {
    return <RepresentativeFour />;
  } else if (user !== null && user.role === Roles.REPRESENTATIVEFIVE) {
    return <RepresentativeFive />;
  } else if (user !== null && user.role === Roles.PHARMACY) {
    return <OrderList />;
  } else if (user !== null && user.role === Roles.AUDITOR) {
    return <Auditor />;
  } else if (user !== null && user.role === Roles.DOCTOR) {
    return <Query />
  }
  else {
    return <UnAuthenticated />;
  }
};

export default AppContainer;
