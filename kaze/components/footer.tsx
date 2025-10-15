export const Footer: React.FC = () => (
  <footer className='flex h-16 flex-col items-center justify-center bg-secondary text-secondary-foreground'>
    <p className='text-center text-sm text-muted-foreground'>
      © {new Date().getFullYear()} Tiesen. All rights reserved.
    </p>
  </footer>
)
