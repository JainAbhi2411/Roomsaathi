import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllMessCentersAdmin, deleteMessCenter } from '@/db/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Utensils, Plus, Edit, Trash2, Search, CheckCircle2, MapPin, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminMessCenters() {
  const [messCenters, setMessCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadMessCenters();
  }, []);

  const loadMessCenters = async () => {
    try {
      setLoading(true);
      const data = await getAllMessCentersAdmin();
      setMessCenters(data);
    } catch (error) {
      console.error('Error loading mess centers:', error);
      toast({
        title: 'Error',
        description: 'Failed to load mess centers',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteMessCenter(id);
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Mess center deleted successfully'
        });
        loadMessCenters();
      } else {
        throw new Error(result.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete mess center',
        variant: 'destructive'
      });
    }
  };

  const filteredMessCenters = messCenters.filter(mess =>
    mess.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mess.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    mess.locality.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Mess Centers</h1>
          <p className="text-muted-foreground">Manage mess and tiffin centers</p>
        </div>
        <Link to="/admin/mess/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Mess Center
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Mess Centers</CardTitle>
          <div className="flex items-center gap-2 mt-4">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, city, or locality..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredMessCenters.length === 0 ? (
            <div className="text-center py-12">
              <Utensils className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No mess centers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Meal Types</TableHead>
                    <TableHead>Monthly Price</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMessCenters.map((mess) => (
                    <TableRow key={mess.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {mess.images && mess.images[0] && (
                            <img
                              src={mess.images[0]}
                              alt={mess.name}
                              className="w-12 h-12 rounded object-cover"
                            />
                          )}
                          <div>
                            <p className="font-medium">{mess.name}</p>
                            {mess.verified && (
                              <Badge variant="secondary" className="mt-1">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground shrink-0" />
                          <div>
                            <p className="text-sm">{mess.locality}</p>
                            <p className="text-xs text-muted-foreground">{mess.city}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {mess.meal_types?.slice(0, 2).map((type: string, i: number) => (
                            <Badge key={i} variant="outline" className="text-xs capitalize">
                              {type}
                            </Badge>
                          ))}
                          {mess.meal_types?.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{mess.meal_types.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold">
                          ₹{mess.pricing?.monthly || 'N/A'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-accent text-accent" />
                          <span className="font-medium">{mess.rating?.toFixed(1) || 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {mess.verified ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Pending</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link to={`/admin/mess/edit/${mess.id}`}>
                            <Button variant="ghost" size="sm">
                              <Edit className="w-4 h-4" />
                            </Button>
                          </Link>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Mess Center</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{mess.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(mess.id)}
                                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Total Mess Centers</p>
              <p className="text-2xl font-bold">{messCenters.length}</p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Verified</p>
              <p className="text-2xl font-bold text-green-600">
                {messCenters.filter(m => m.verified).length}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-2xl font-bold text-orange-600">
                {messCenters.filter(m => !m.verified).length}
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
              <p className="text-2xl font-bold">
                {messCenters.length > 0
                  ? (messCenters.reduce((acc, m) => acc + (m.rating || 0), 0) / messCenters.length).toFixed(1)
                  : '0.0'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
