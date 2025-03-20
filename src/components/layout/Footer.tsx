
import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

const Footer = () => {
  const currentYear = new Date().getFullYear();

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
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-1 sm:col-span-2 md:col-span-1">
            <Logo variant="light" />
            <p className="text-gray-400 text-sm mt-2">
              AI-powered name generator for all your needs
            </p>
          </div>

          <div>
            <h3 className="font-medium text-base mb-3">Generators</h3>
            <ul className="space-y-2 text-sm">
              {generatorCategories.slice(0, 4).map((category) => (
                <li key={category.path}>
                  <Link to={category.path} className="text-gray-400 hover:text-white transition">
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-base mb-3">Special Generators</h3>
            <ul className="space-y-2 text-sm">
              {generatorCategories.slice(4).map((category) => (
                <li key={category.path}>
                  <Link to={category.path} className="text-gray-400 hover:text-white transition">
                    {category.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-base mb-3">Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link to="/blog" className="text-gray-400 hover:text-white transition">Blog</Link></li>
              <li><Link to="/pricing" className="text-gray-400 hover:text-white transition">Pricing</Link></li>
              <li><Link to="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</Link></li>
              <li><Link to="/refund" className="text-gray-400 hover:text-white transition">Refund Policy</Link></li>
              <li><a href="mailto:info@namehive.fun" className="text-gray-400 hover:text-white transition">Contact</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-xs text-gray-500">
          <p>&copy; {currentYear} Name Hive. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
