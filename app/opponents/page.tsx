'use client';
import React from 'react';
import ListComponent from '../_components/Opponents/List/ListComponent';
import CreateOpponentComponent from '../_components/Opponents/CreateOpponent/CreateOpponentComponent';

export default function OpponentsPage() {
  return (
    <>
      <ListComponent />
      <CreateOpponentComponent />
    </>
  );
}
