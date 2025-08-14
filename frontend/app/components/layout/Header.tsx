import { Link, useNavigate } from "react-router";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { useAuth } from "~/lib/auth";
import { ShoppingCart, User, Package, Truck } from "~/components/ui/icons";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "vendor":
        return <Package className='h-4 w-4' />;
      case "shipper":
        return <Truck className='h-4 w-4' />;
      default:
        return <User className='h-4 w-4' />;
    }
  };

  const getRoleLinks = () => {
    if (!user) return null;

    switch (user.role) {
      case "vendor":
        return (
          <>
            <DropdownMenuItem asChild>

              <Link to='/vendor/products'>My Products</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>

              <Link to='/vendor/products/new'>Add Product</Link>
            </DropdownMenuItem>
          </>
        );
      case "shipper":
        return (
          <DropdownMenuItem asChild>
            <Link to='/shipper/orders'>Active Orders</Link>
          </DropdownMenuItem>
        );
      case "customer":
        return (
          <DropdownMenuItem asChild>
            <Link to='/cart'>
              
              Shopping Cart
            </Link>
          </DropdownMenuItem>
        );
      default:
        return null;
    }
  };

  return (
    <header className='border-b bg-white'>
      <div className='container mx-auto flex items-center justify-between px-4 py-3'>
        <Link to='/' className='flex items-center gap-2'>
          <div className='h-8 w-8 bg-black rounded flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>L</span>
          </div>
          <span className='font-semibold text-xl'>Lazada Lite</span>
        </Link>

        <nav className='hidden md:flex items-center gap-6'>
          <Link
            to='/products'
            className='text-sm hover:underline transition-colors'
          >
            Browse Products
          </Link>
          <Link
            to='/about'
            className='text-sm hover:underline transition-colors'
          >
            About
          </Link>
          <Link
            to='/help'
            className='text-sm hover:underline transition-colors'
          >
            Help
          </Link>
        </nav>

        <div className='flex items-center gap-3'>
          {isAuthenticated() && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='flex items-center gap-2'>
                  <Avatar className='h-8 w-8'>
                    <AvatarFallback>{getRoleIcon(user.role)}</AvatarFallback>
                  </Avatar>
                  <span className='hidden sm:inline'>
                    {user.name || user.businessName || user.username}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuItem asChild>
                  <Link to='/account'>My Account</Link>
                </DropdownMenuItem>
                {getRoleLinks()}
                <DropdownMenuItem onClick={handleLogout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className='flex items-center gap-2'>
              <Link to='/login'>
                <Button variant='outline' size='sm'>
                  Login
                </Button>
              </Link>
              <Link to='/register/customer'>
                <Button size='sm'>Sign Up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
