import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className='border-t bg-white'>
      <div className='container mx-auto px-4 py-8'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='space-y-4'>
            <div className='flex items-center gap-2'>
              <div className='h-6 w-6 bg-black rounded flex items-center justify-center'>
                <span className='text-white font-bold text-xs'>L</span>
              </div>
              <span className='font-semibold'>Lazada Lite</span>
            </div>
            <p className='text-sm text-muted-foreground'>
              A simplified e-commerce platform for educational purposes.
            </p>
          </div>

          <div className='space-y-4'>
            <h3 className='font-semibold'>Quick Links</h3>
            <div className='space-y-2 text-sm'>
              <Link
                to='/products'
                className='block hover:underline transition-colors'
              >
                Browse Products
              </Link>
              <Link
                to='/about'
                className='block hover:underline transition-colors'
              >
                About Us
              </Link>
              <Link
                to='/help'
                className='block hover:underline transition-colors'
              >
                Help & Support
              </Link>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='font-semibold'>For Sellers</h3>
            <div className='space-y-2 text-sm'>
              <Link
                to='/register/vendor'
                className='block hover:underline transition-colors'
              >
                Become a Vendor
              </Link>
              <Link
                to='/register/shipper'
                className='block hover:underline transition-colors'
              >
                Join as Shipper
              </Link>
            </div>
          </div>

          <div className='space-y-4'>
            <h3 className='font-semibold'>Legal</h3>
            <div className='space-y-2 text-sm'>
              <Link
                to='/privacy'
                className='block hover:underline transition-colors'
              >
                Privacy Policy
              </Link>
              <Link
                to='/terms'
                className='block hover:underline transition-colors'
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>

        <div className='border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center'>
          <div className='text-sm text-muted-foreground'>
            © {new Date().getFullYear()} Lazada Lite. Student Project -
            Educational Use Only.
          </div>
          <div className='text-sm text-muted-foreground mt-2 sm:mt-0'>
            Built with React Router v7 & Tailwind CSS
          </div>
        </div>
      </div>
    </footer>
  );
}
