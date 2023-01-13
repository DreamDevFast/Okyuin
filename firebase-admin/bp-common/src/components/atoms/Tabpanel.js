import React from 'react';
import Datatable from './Datatable';
import {db} from '../../firebase';
import {
  collection,
  query,
  orderBy,
  where,
  onSnapshot,
} from 'firebase/firestore';
import TransitionsModal from './TransitionModal';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import {Box, CircularProgress} from '@mui/material';

const Relation = {
  initial: 0,
  like: 1,
  dislike: 2,
  favorite: 3,
};

var unsubscribe;
const TabPanel = props => {
  const {children, value, index} = props;
  const [users, setUsers] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (value !== index) return;
    // console.log('entered');
    const q = query(
      collection(db, 'Users'),
      where('role', '==', value === 0 ? 'girl' : 'shop'),
    );
    setLoading(true);
    onSnapshot(q, async querySnapshot => {
      const tempUsers = [];
      for (let i = 0; i < querySnapshot.docs.length; i++) {
        console.log('i', i, value);
        const doc = querySnapshot.docs[i];
        const relationQ1 = query(
          collection(db, 'Relations'),
          where('user1', '==', doc.id),
          where('relation1', 'in', [Relation.favorite, Relation.like]),
        );
        const relationQ2 = query(
          collection(db, 'Relations'),
          where('user2', '==', doc.id),
          where('relation2', 'in', [Relation.favorite, Relation.like]),
        );
        let matchingCount = 0;
        await new Promise(
          resolve =>
            (unsubscribe = onSnapshot(relationQ1, async querySnapshot1 => {
              console.log('first query', querySnapshot1.docs.length);
              matchingCount += querySnapshot1.docs.filter(
                doc =>
                  doc.data().relation2 === Relation.like ||
                  doc.data().relation2 === Relation.favorite,
              ).length;
              console.log('matchingCount1', matchingCount, value);
              resolve();
            })),
        );
        unsubscribe();
        await new Promise(
          resolve =>
            (unsubscribe = onSnapshot(relationQ2, querySnapshot2 => {
              console.log(
                'query2 docs lenghth ',
                querySnapshot2.docs.length,
                matchingCount,
                value,
              );
              matchingCount += querySnapshot2.docs.filter(
                doc =>
                  doc.data().relation1 === Relation.like ||
                  doc.data().relation1 === Relation.favorite,
              ).length;
              console.log(matchingCount);
              resolve();
            })),
        );
        unsubscribe();
        console.log('matchingCount2', matchingCount, value);

        tempUsers.push({
          id: doc.id,
          data: doc.data(),
          matchingCount,
        });
      }
      //   console.log(tempUsers);
      setUsers(tempUsers);
      setLoading(false);
      //   // setUsers(
      //   //   querySnapshot.docs.map(doc => ({
      //   //     id: doc.id,
      //   //     data: doc.data(),
      //   //   })),
      //   // );
    });

    // const relationQ1 = query(
    //   collection(db, 'Relations'),
    //   where('user1', '==', 'QQ4kkKXHbETdgE3hptm5'),
    //   where('relation1', 'in', [Relation.favorite, Relation.like]),
    // );
    // onSnapshot(relationQ1, querySnapshot => console.log(querySnapshot.docs));
  }, [value]);

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
    >
      {loading && (
        <Box sx={{position: 'absolute', top: '40vh', left: '50vw'}}>
          <CircularProgress />
        </Box>
      )}
      {value === 1 && <TransitionsModal />}
      {value === index && <Datatable users={users} />}
    </div>
  );
};

export default TabPanel;
