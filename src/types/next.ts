// src/types/next.ts
import { type Metadata } from 'next';

export type PageParams = {
  params: Record<string, string>;
  searchParams?: Record<string, string | string[] | undefined>;
};

export type LayoutProps = {
  children: React.ReactNode;
  params?: Record<string, string>;
};

export type GenerateMetadata = {
  params: Record<string, string>;
  searchParams?: Record<string, string | string[] | undefined>;
} & Metadata;