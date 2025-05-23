"use client";

import React from 'react';
import { cn } from '../../lib/utils/cn';

interface HeadingProps {
  title: string;
  subtitle?: string;
  className?: string;
  subtitleClassName?: string;
  gradient?: boolean;
}

export function Heading({
  title,
  subtitle,
  className = '',
  subtitleClassName = '',
  gradient = false, // keeping prop for backward compatibility
}: HeadingProps) {
  return (
    <div className={cn('space-y-2 text-center', className)}>
      <h1 
        className={cn('text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl')}
      >
        {title}
      </h1>
      {subtitle && (
        <p className={cn('text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400', subtitleClassName)}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
