
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
