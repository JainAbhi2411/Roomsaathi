export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 xl:grid-cols-4">
          <div className="xl:col-span-2">
            <h3 className="text-lg font-bold gradient-text mb-2">RoomSaathi</h3>
            <p className="text-sm text-muted-foreground">
              Your trusted partner in finding the perfect accommodation. Browse PG, flats, apartments, rooms, and hostels in Sikar, Jaipur, and Kota.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/" className="hover:text-primary transition-colors">Browse Properties</a></li>
              <li><a href="/favorites" className="hover:text-primary transition-colors">My Favorites</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3">Cities</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Sikar</li>
              <li>Jaipur</li>
              <li>Kota</li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>&copy; 2026 RoomSaathi. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
