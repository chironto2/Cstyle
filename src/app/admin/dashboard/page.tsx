'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Container from '@/components/shared/Container';
import { useToast } from '@/hooks/use-toast';
import { BarChart3, Settings, Upload, Plus, Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

interface HeroSlide {
  _id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  isActive: boolean;
  displayOrder: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { toast } = useToast();
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    buttonText: '',
    buttonLink: '',
    displayOrder: 0,
  });

  useEffect(() => {
    checkAdminAccess();
    fetchHeroSlides();
  }, []);

  const checkAdminAccess = () => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      toast({
        title: 'Access Denied',
        description: 'Only admins can access this page.',
        variant: 'destructive',
      });
      router.push('/');
    }
  };

  const fetchHeroSlides = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/hero-slides', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setHeroSlides(data);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch hero slides',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.imageUrl) {
      toast({
        title: 'Validation Error',
        description: 'Title and Image URL are required',
        variant: 'destructive',
      });
      return;
    }

    try {
      const url = editingSlide
        ? `/api/admin/hero-slides/${editingSlide._id}`
        : '/api/admin/hero-slides';
      
      const method = editingSlide ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: editingSlide ? 'Slide updated successfully' : 'Slide created successfully',
        });
        resetForm();
        fetchHeroSlides();
      } else {
        const error = await response.json();
        toast({
          title: 'Error',
          description: error.message || 'Failed to save slide',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleEdit = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || '',
      imageUrl: slide.imageUrl,
      buttonText: slide.buttonText || '',
      buttonLink: slide.buttonLink || '',
      displayOrder: slide.displayOrder,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this slide?')) return;

    try {
      const response = await fetch(`/api/admin/hero-slides/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: 'Slide deleted successfully',
        });
        fetchHeroSlides();
      } else {
        toast({
          title: 'Error',
          description: 'Failed to delete slide',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    }
  };

  const handleToggleActive = async (slide: HeroSlide) => {
    try {
      const response = await fetch(`/api/admin/hero-slides/${slide._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ ...slide, isActive: !slide.isActive }),
      });

      if (response.ok) {
        toast({
          title: 'Success',
          description: `Slide ${!slide.isActive ? 'activated' : 'deactivated'}`,
        });
        fetchHeroSlides();
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update slide status',
        variant: 'destructive',
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      subtitle: '',
      imageUrl: '',
      buttonText: '',
      buttonLink: '',
      displayOrder: 0,
    });
    setEditingSlide(null);
    setShowForm(false);
  };

  return (
    <Container className="py-8">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
              <BarChart3 className="text-primary" size={32} />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">Manage your store content and settings</p>
          </div>
          <Button
            onClick={() => {
              resetForm();
              setShowForm(!showForm);
            }}
            className="w-full md:w-auto"
            size="lg"
          >
            <Plus size={20} className="mr-2" />
            Add New Slide
          </Button>
        </div>

        {/* Form Section */}
        {showForm && (
          <Card className="border-2 border-primary/20">
            <CardHeader>
              <CardTitle>{editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}</CardTitle>
              <CardDescription>
                {editingSlide ? 'Update the slide details' : 'Add a new hero slider image to your homepage'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Title *</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Slide title"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Subtitle</label>
                    <input
                      type="text"
                      value={formData.subtitle}
                      onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                      placeholder="Slide subtitle"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URL *</label>
                  <input
                    type="url"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                  {formData.imageUrl && (
                    <img
                      src={formData.imageUrl}
                      alt="Preview"
                      className="mt-4 max-h-64 rounded-lg object-cover w-full"
                      onError={() =>
                        toast({
                          title: 'Image Error',
                          description: 'Failed to load image. Please check the URL.',
                          variant: 'destructive',
                        })
                      }
                    />
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Button Text</label>
                    <input
                      type="text"
                      value={formData.buttonText}
                      onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                      placeholder="e.g., Shop Now"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Button Link</label>
                    <input
                      type="text"
                      value={formData.buttonLink}
                      onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                      placeholder="/shop"
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Display Order</label>
                    <input
                      type="number"
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingSlide ? 'Update Slide' : 'Create Slide'}
                  </Button>
                  <Button type="button" variant="outline" onClick={resetForm}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Hero Slides List */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Hero Slides</h2>
          {loading ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">Loading hero slides...</p>
              </CardContent>
            </Card>
          ) : heroSlides.length === 0 ? (
            <Card>
              <CardContent className="py-12">
                <p className="text-center text-muted-foreground">No hero slides yet. Create one to get started!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {heroSlides.map((slide) => (
                <Card key={slide._id} className={`overflow-hidden ${!slide.isActive ? 'opacity-60' : ''}`}>
                  <div className="relative h-48 bg-gray-100">
                    <img
                      src={slide.imageUrl}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                      }}
                    />
                    {!slide.isActive && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <p className="text-white font-semibold">Inactive</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="pt-4">
                    <h3 className="text-lg font-bold truncate">{slide.title}</h3>
                    {slide.subtitle && <p className="text-sm text-muted-foreground truncate">{slide.subtitle}</p>}
                    {slide.buttonText && (
                      <p className="text-xs text-primary font-medium mt-2">Button: {slide.buttonText}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">Order: {slide.displayOrder}</p>

                    <div className="flex gap-2 mt-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleToggleActive(slide)}
                        className="flex-1"
                      >
                        {slide.isActive ? <EyeOff size={16} /> : <Eye size={16} />}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEdit(slide)}
                        className="flex-1"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(slide._id)}
                        className="flex-1"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings size={24} />
              Dashboard Info
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Hero Slides</p>
              <p className="text-2xl font-bold">{heroSlides.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Slides</p>
              <p className="text-2xl font-bold">{heroSlides.filter((s) => s.isActive).length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Inactive Slides</p>
              <p className="text-2xl font-bold">{heroSlides.filter((s) => !s.isActive).length}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}
