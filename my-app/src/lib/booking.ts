import { db } from '@/firebase/client';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';

export interface Booking {
  roomId: string;
  start: Date;
  end: Date;
  createdBy: string;
  description: string;
}

export const createBooking = async ({
  roomId,
  start,
  end,
  createdBy,
  description,
}: Booking) => {
  const q = query(collection(db, 'bookings'), where('roomId', '==', roomId));
  const existing = await getDocs(q);

  for (const docSnap of existing.docs) {
    const data = docSnap.data();
    const existingStart = new Date(data.start);
    const existingEnd = new Date(data.end);

    const overlap = start < existingEnd && end > existingStart;

    if (overlap) throw new Error('Час вже зайнятий');
  }

  const bookingRef = await addDoc(collection(db, 'bookings'), {
    roomId,
    start: start.toISOString(),
    end: end.toISOString(),
    createdBy,
    description,
    createdAt: Date.now(),
  });

  return bookingRef.id;
};
