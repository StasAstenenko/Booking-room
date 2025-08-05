import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/client';

export const fixAllRoomRoles = async () => {
  const roomsSnap = await getDocs(collection(db, 'rooms'));

  for (const roomDoc of roomsSnap.docs) {
    const data = roomDoc.data();

    if (data.roles && typeof data.roles === 'object') {
      const fixedRoles: Record<string, 'admin' | 'user'> = {};

      for (const [email, role] of Object.entries(data.roles)) {
        if (role === 'admin' || role === 'user') {
          fixedRoles[email] = role;
        } else if (role && typeof role === 'object' && 'com' in role) {
          const extracted = role.com;
          if (extracted === 'admin' || extracted === 'user') {
            fixedRoles[email] = extracted;
          } else {
            fixedRoles[email] = 'user';
          }
        } else {
          fixedRoles[email] = 'user';
        }
      }

      await updateDoc(doc(db, 'rooms', roomDoc.id), {
        roles: fixedRoles,
      });
    }
  }
};
