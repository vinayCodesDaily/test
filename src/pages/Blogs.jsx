import { useEffect, useState } from 'react';
import { cmsAPI } from '../api/endpoints/cms';
import Loading from '../components/Common/Loading';

const Blogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await cmsAPI.getBlogs();
                if (res.data.success) setBlogs(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    return (
        <div style={{ maxWidth: 1000, margin: '24px auto', padding: '0 16px' }}>
            <h1>Travel Blog</h1>
            <p style={{ color: 'var(--text-muted)' }}>Read our latest travel stories and guides.</p>
            {loading ? <Loading message="Loading articles..." /> : (
                <div style={{ display: 'grid', gap: '16px' }}>
                    {blogs.map(b => (
                        <div key={b.id} className="card">
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <img src={b.image_url} alt={b.title} style={{ width: 160, height: 100, objectFit: 'cover', borderRadius: 8 }} />
                                <div>
                                    <h3 style={{ margin: 0 }}>{b.title}</h3>
                                    <p style={{ margin: '6px 0', color: 'var(--text-muted)' }}>{b.summary}</p>
                                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>By {b.author} • {b.published_at}</div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blogs;
