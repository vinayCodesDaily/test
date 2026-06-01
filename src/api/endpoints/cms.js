import axiosClient from '../axiosClient';

export const cmsAPI = {
    // Public
    getBlogs: (params = {}) => axiosClient.get('/blogs', { params }),
    getBlogBySlug: (slug) => axiosClient.get(`/blogs/${slug}`),
    getTestimonials: (params = {}) =>
        axiosClient.get('/testimonials', { params }),
    submitContact: (data) => axiosClient.post('/contact', data),

    // Authenticated
    submitTestimonial: (data) => axiosClient.post('/testimonials', data),

    // Manager
    createBlog: (data) => axiosClient.post('/blogs', data),
    updateBlog: (id, data) => axiosClient.put(`/blogs/${id}`, data),
    approveTestimonial: (id) =>
        axiosClient.post(`/testimonials/${id}/approve`),
    getContactSubmissions: (params = {}) =>
        axiosClient.get('/contact-submissions', { params }),
    respondToContact: (id, data) =>
        axiosClient.post(`/contact-submissions/${id}/respond`, data),

    // Gallery management
    getGallery: (params = {}) => axiosClient.get('/gallery', { params }),
    createGalleryItem: (data) => axiosClient.post('/gallery', data),
    deleteGalleryItem: (id) => axiosClient.delete(`/gallery/${id}`),

    // Monthly recommendations (editable by manager)
    getRecommendations: (params = {}) => axiosClient.get('/recommendations', { params }),
    updateRecommendations: (data) => axiosClient.post('/recommendations', data),

    // About page content
    getAbout: () => axiosClient.get('/about'),
    updateAbout: (data) => axiosClient.put('/about', data),
};
