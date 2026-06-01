import { useEffect, useState } from 'react';
import { cmsAPI } from '../api/endpoints/cms';
import Loading from '../components/Common/Loading';

const About = () => {
    const [about, setAbout] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await cmsAPI.getAbout();
                if (res.data.success) setAbout(res.data.data);
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
            <h1>About Us</h1>
            {loading ? <Loading message="Fetching about content..." /> : (
                about ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <p style={{ fontSize: 16, lineHeight: 1.7 }}>{about.content}</p>
                        <h3>Achievements & Awards</h3>
                        {about.achievements && about.achievements.length > 0 ? (
                            <ul>
                                {about.achievements.map((a, i) => <li key={i}>{a}</li>)}
                            </ul>
                        ) : <p style={{ color: 'var(--text-muted)' }}>No awards listed yet.</p>}
                    </div>
                ) : <p>No about content available.</p>
            )}
        </div>
    );
};

export default About;
