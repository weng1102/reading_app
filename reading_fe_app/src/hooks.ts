import { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
import { useRef } from "react";
import { RootState, AppDispatch } from "./store";

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useSpanRef = () => useRef<HTMLSpanElement | null>(null);
export const useDivRef = () => useRef<HTMLDivElement | null>(null);
export const useElementRef = () => useRef<HTMLElement | null>(null);
