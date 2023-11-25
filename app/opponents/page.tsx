'use client';
import React, { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, SubmitHandler } from "react-hook-form";
import { useOpponents, useOpponentsUpdate } from '../_context/OpponentsProvider';
import { useSearchConditionsUpdate } from '../_context/SearchConditionsProvider';
import { TOpponent } from '../_libs/types';
import ValidationErrorText from '../_components/common/ValidationErrorText';
import { storeOpponent } from '../_libs/data';
import { useLiff } from '../_context/LiffProvider';
import ListComponent from '../_components/Opponents/List/ListComponent';

type FormData = {
  name: string;
};

export default function OpponentsPage() {
  return (
    <>
      <ListComponent />
    </>
  );
}
