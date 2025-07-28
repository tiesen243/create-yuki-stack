export const Footer: React.FC = () => (
  <footer className='bg-secondary text-secondary-foreground flex h-16 flex-col items-center justify-center'>
    <p className='text-muted-foreground text-center text-sm'>
      © {new Date().getFullYear()} Tiesen. All rights reserved.
    </p>
  </footer>
)
