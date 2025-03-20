
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="page-container">
        <div className="grid gap-6 md:grid-cols-4">
          <div>
            <Logo variant="light" />
            <p className="text-gray-400 text-sm mt-2">
              AI-powered name generator for all your needs
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-2">Generators</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/business-brand" className="text-gray-400 hover:text-white transition">Business & Brand</Link></li>
              <li><Link to="/personal-social" className="text-gray-400 hover:text-white transition">Personal & Social</Link></li>
              <li><Link to="/writing-creative" className="text-gray-400 hover:text-white transition">Writing & Creative</Link></li>
              <li><Link to="/niche-specific" className="text-gray-400 hover:text-white transition">Niche-Specific</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-2">Special Generators</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/tech-industry" className="text-gray-400 hover:text-white transition">Tech Industry</Link></li>
              <li><Link to="/geographical-local" className="text-gray-400 hover:text-white transition">Geographical</Link></li>
              <li><Link to="/fantasy-gaming" className="text-gray-400 hover:text-white transition">Fantasy & Gaming</Link></li>
              <li><Link to="/specialty-fun" className="text-gray-400 hover:text-white transition">Specialty & Fun</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-base mb-2">Links</h3>
            <ul className="space-y-1 text-sm">
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition">Blog</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link></li>
              <li><Link to="/sitemap" className="text-gray-400 hover:text-white transition">Sitemap</Link></li>
              <li><a href="mailto:info@namehive.fun" className="text-gray-400 hover:text-white transition">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-4 text-center text-xs text-gray-500">
          <p>&copy; {currentYear} Name Hive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import { Link } from 'react-router-dom';

const Footer = () => {
  const generatorCategories = [
    { title: 'Business & Brand', path: '/business-brand' },
    { title: 'Personal & Social', path: '/personal-social' },
    { title: 'Writing & Creative', path: '/writing-creative' },
    { title: 'Tech Industry', path: '/tech-industry' },
    { title: 'Geographical & Local', path: '/geographical-local' },
    { title: 'Fantasy & Gaming', path: '/fantasy-gaming' },
    { title: 'Niche-Specific', path: '/niche-specific' },
    { title: 'Specialty & Fun', path: '/specialty-fun' },
  ];

  return (
    <footer className="bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Generator Categories</h3>
            <ul className="space-y-2">
              {generatorCategories.map((category) => (
                <li key={category.path}>
                  <Link to={category.path} className="text-gray-600 hover:text-gray-900">
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/about" className="text-gray-600 hover:text-gray-900">About Us</Link></li>
              <li><Link to="/contact" className="text-gray-600 hover:text-gray-900">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><Link to="/privacy" className="text-gray-600 hover:text-gray-900">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-600 hover:text-gray-900">Terms of Service</Link></li>
              <li><Link to="/refund-policy" className="text-gray-600 hover:text-gray-900">Refund Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-gray-600">© {new Date().getFullYear()} Name Generator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
