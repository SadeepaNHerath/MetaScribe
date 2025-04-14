export function AppFooter() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-primary mb-4">SEO Tag Analyzer</h3>
            <p className="text-gray-600 text-sm">
              A powerful tool to analyze and optimize your website's meta tags for better search engine and social media presence.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-4">Resources</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-primary">SEO Best Practices</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Meta Tags Guide</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Social Media Optimization</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Blog</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold text-gray-700 mb-4">Company</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-600 hover:text-primary">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Privacy Policy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Terms of Service</a></li>
              <li><a href="#" className="text-gray-600 hover:text-primary">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
          &copy; {new Date().getFullYear()} SEO Tag Analyzer. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
