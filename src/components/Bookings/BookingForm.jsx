import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { bookingsAPI } from '../../api/endpoints/bookings';
import { useApi } from '../../api/hooks/useApi';

export const BookingForm = ({ packageId }) => {
    const [formData, setFormData] = useState({
        package_id: packageId,
        travel_date: '',
        number_of_travelers: 1,
        hotel_id: 'Standard Hotel',
        flight_id: '',
        special_requests: '',
    });

    const { loading, error } = useApi();
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'number_of_travelers' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await bookingsAPI.create(formData);
            if (res.data.success) {
                const bookingId = res.data.data.booking.id;
                alert('Booking created successfully! Redirecting to booking manager...');
                navigate(`/bookings/${bookingId}`);
            } else {
                alert(res.data.message || 'Failed to submit booking');
            }
        } catch (err) {
            console.error('Booking failed:', err);
            alert(err.response?.data?.message || 'Error occurred creating booking.');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {error && <div className="alert alert-danger">❌ {error}</div>}

            <div className="form-group">
                <label className="form-label">Departure Travel Date</label>
                <input
                    type="date"
                    name="travel_date"
                    value={formData.travel_date}
                    onChange={handleChange}
                    required
                    className="form-control"
                    min={new Date().toISOString().split('T')[0]}
                />
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label className="form-label">Guests Count</label>
                    <input
                        type="number"
                        name="number_of_travelers"
                        value={formData.number_of_travelers}
                        onChange={handleChange}
                        min="1"
                        max="20"
                        required
                        className="form-control"
                    />
                </div>
                
                <div className="form-group">
                    <label className="form-label">Hotel Selection</label>
                    <select
                        name="hotel_id"
                        value={formData.hotel_id}
                        onChange={handleChange}
                        className="form-control"
                    >
                        <option value="Standard Hotel">Standard Accommodation (Included)</option>
                        <option value="Deluxe Hotel">Deluxe Stay (+ ₹3,000 / Night)</option>
                        <option value="Premium Resort">Luxury Resort & Spa (+ ₹6,000 / Night)</option>
                    </select>
                </div>
            </div>

            <div className="form-group">
                <label className="form-label">Round-Trip Flights Option</label>
                <select
                    name="flight_id"
                    value={formData.flight_id}
                    onChange={handleChange}
                    className="form-control"
                >
                    <option value="">No Flights Needed (Self Travel)</option>
                    <option value="IndiGo Flight">IndiGo Economy Class (+ ₹6,500 / Seat)</option>
                    <option value="Air India Flight">Air India Premium Economy (+ ₹11,000 / Seat)</option>
                    <option value="Vistara Flight">Vistara Business Class (+ ₹24,000 / Seat)</option>
                </select>
            </div>

            <div className="form-group">
                <label className="form-label">Custom requests or dietary guidelines</label>
                <textarea
                    name="special_requests"
                    value={formData.special_requests}
                    onChange={handleChange}
                    rows="3"
                    className="form-control"
                    placeholder="e.g. Vegetarian breakfast options, wheelchair accessibility needs..."
                />
            </div>

            <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ width: '100%', height: '44px', marginTop: '8px' }}
            >
                {loading ? 'Securing bookings slots...' : 'Confirm & Proceed to Booking'}
            </button>
        </form>
    );
};

export default BookingForm;
