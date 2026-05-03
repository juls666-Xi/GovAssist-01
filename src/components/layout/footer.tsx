export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-gov-800 mb-2">GovAssist Pro</h3>
            <p className="text-sm text-muted-foreground">
              Secure online platform for government assistance applications and document management.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gov-800 mb-2">Quick Links</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>About Us</li>
              <li>Contact</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gov-800 mb-2">Contact</h3>
            <p className="text-sm text-muted-foreground">
              support@govassist.local<br />
              +63-2-8123-4567
            </p>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} GovAssist Pro. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
