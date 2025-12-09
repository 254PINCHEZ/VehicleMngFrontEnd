// src/pages/Admin/Content.tsx
import React, { useState } from 'react';
import AdminDashboardLayout from '../../components/Dashboard/admDashboardLayout';
import { FileText, Image, Video, File, Plus, Edit, Trash2, Eye, Upload, Search } from 'lucide-react';

interface ContentItem {
  id: string;
  title: string;
  type: 'article' | 'image' | 'video' | 'document';
  status: 'published' | 'draft' | 'archived';
  created_at: string;
  updated_at: string;
  author: string;
  views?: number;
}

const AdminContent: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Mock data - replace with API data
  const contentItems: ContentItem[] = [
    {
      id: '1',
      title: 'Getting Started with Vehicle Rentals',
      type: 'article',
      status: 'published',
      created_at: '2024-01-15T10:30:00Z',
      updated_at: '2024-01-16T14:20:00Z',
      author: 'Admin User',
      views: 1250
    },
    {
      id: '2',
      title: 'How to Cancel a Booking',
      type: 'article',
      status: 'published',
      created_at: '2024-01-10T09:15:00Z',
      updated_at: '2024-01-10T09:15:00Z',
      author: 'Support Team',
      views: 890
    },
    {
      id: '3',
      title: 'Vehicle Safety Guidelines',
      type: 'article',
      status: 'draft',
      created_at: '2024-01-18T16:45:00Z',
      updated_at: '2024-01-18T16:45:00Z',
      author: 'Admin User'
    },
    {
      id: '4',
      title: 'Promotional Banner - Summer Sale',
      type: 'image',
      status: 'published',
      created_at: '2024-01-05T11:20:00Z',
      updated_at: '2024-01-05T11:20:00Z',
      author: 'Marketing Team'
    },
    {
      id: '5',
      title: 'How to Use Our Mobile App',
      type: 'video',
      status: 'published',
      created_at: '2024-01-12T13:40:00Z',
      updated_at: '2024-01-12T13:40:00Z',
      author: 'Tech Team',
      views: 2150
    }
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'article': return <FileText size={16} className="text-blue-500" />;
      case 'image': return <Image size={16} className="text-green-500" />;
      case 'video': return <Video size={16} className="text-purple-500" />;
      case 'document': return <File size={16} className="text-orange-500" />;
      default: return <FileText size={16} />;
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      published: { color: 'badge-success', label: 'Published' },
      draft: { color: 'badge-warning', label: 'Draft' },
      archived: { color: 'badge-neutral', label: 'Archived' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <span className={`badge ${config.color} text-white text-xs`}>
        {config.label}
      </span>
    );
  };

  const filteredContent = contentItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <AdminDashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FileText className="text-purple-600" size={24} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Content Management</h1>
            <p className="text-sm text-gray-600">Manage articles, images, videos, and documents</p>
          </div>
        </div>
        <button className="btn btn-primary">
          <Plus size={18} />
          Add New Content
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search content..."
              className="input input-bordered w-full pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Type Filter */}
          <div>
            <label className="label">
              <span className="label-text">Content Type</span>
            </label>
            <select 
              className="select select-bordered w-full"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="article">Articles</option>
              <option value="image">Images</option>
              <option value="video">Videos</option>
              <option value="document">Documents</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="label">
              <span className="label-text">Status</span>
            </label>
            <select 
              className="select select-bordered w-full"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Content</p>
              <p className="text-2xl font-bold">{contentItems.length}</p>
            </div>
            <FileText className="text-blue-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Published</p>
              <p className="text-2xl font-bold">{contentItems.filter(c => c.status === 'published').length}</p>
            </div>
            <Eye className="text-green-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Drafts</p>
              <p className="text-2xl font-bold">{contentItems.filter(c => c.status === 'draft').length}</p>
            </div>
            <FileText className="text-yellow-500" size={24} />
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Views</p>
              <p className="text-2xl font-bold">{contentItems.reduce((sum, item) => sum + (item.views || 0), 0).toLocaleString()}</p>
            </div>
            <Eye className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Content Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="font-semibold text-gray-700">Content</th>
                <th className="font-semibold text-gray-700">Type</th>
                <th className="font-semibold text-gray-700">Status</th>
                <th className="font-semibold text-gray-700">Author</th>
                <th className="font-semibold text-gray-700">Created</th>
                <th className="font-semibold text-gray-700 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContent.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-500">
                    No content found matching your filters
                  </td>
                </tr>
              ) : (
                filteredContent.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {getTypeIcon(item.type)}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{item.title}</div>
                          {item.views && (
                            <div className="text-sm text-gray-500">
                              {item.views.toLocaleString()} views
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="capitalize">{item.type}</span>
                    </td>
                    <td>
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="text-gray-700">{item.author}</td>
                    <td className="text-gray-600 text-sm">{formatDate(item.created_at)}</td>
                    <td>
                      <div className="flex items-center justify-center gap-2">
                        <button className="btn btn-ghost btn-xs text-blue-600 tooltip" data-tip="Preview">
                          <Eye size={14} />
                        </button>
                        <button className="btn btn-ghost btn-xs text-green-600 tooltip" data-tip="Edit">
                          <Edit size={14} />
                        </button>
                        <button className="btn btn-ghost btn-xs text-red-600 tooltip" data-tip="Delete">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination/Summary */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Showing {filteredContent.length} of {contentItems.length} content items
            </div>
            <div className="join">
              <button className="join-item btn btn-sm">«</button>
              <button className="join-item btn btn-sm btn-active">1</button>
              <button className="join-item btn btn-sm">2</button>
              <button className="join-item btn btn-sm">»</button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="btn btn-outline justify-start">
            <Upload size={18} />
            Upload Media
          </button>
          <button className="btn btn-outline justify-start">
            <FileText size={18} />
            Write Article
          </button>
          <button className="btn btn-outline justify-start">
            <Video size={18} />
            Add Video
          </button>
        </div>
      </div>
    </AdminDashboardLayout>
  );
};

export default AdminContent;