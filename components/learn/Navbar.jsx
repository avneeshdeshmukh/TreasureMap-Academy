import Link from 'next/link';

const Navbar = () => {
  return (
    <nav className="p-5 w-full" style={{backgroundColor: '#fdba0d'}}>
      <div className="container mx-auto flex justify-end items-center">
        <div className="space-x-4">
          <Link href="/" className="text-white hover:text-gray-400">Home</Link>
          <Link href="/about" className="text-white hover:text-gray-400">About</Link>
          <Link href="/services" className="text-white hover:text-gray-400">Services</Link>
          <Link href="/contact" className="text-white hover:text-gray-400">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
