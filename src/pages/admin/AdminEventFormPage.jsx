import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { createEvent, getEvent, updateEvent } from '../../api/events.js';
import Button from '../../components/ui/Button.jsx';
import FormField from '../../components/ui/FormField.jsx';
import PageHeader from '../../components/ui/PageHeader.jsx';
import StateMessage from '../../components/ui/StateMessage.jsx';
import { useAsync } from '../../hooks/useAsync.js';
import { validateEvent } from '../../utils/validation.js';

const emptyForm = {
  title: '', category: '', date: '', time: '', venue: '', city: '',
  description: '', image: '/images/event-1.svg', status: 'draft'
};

export default function AdminEventFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const { status, data: event, error } = useAsync(
    () => (id ? getEvent(id) : Promise.resolve(null)),
    [id]
  );
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [requestError, setRequestError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (event) {
      setForm({
        title: event.title, category: event.category, date: event.date, time: event.time,
        venue: event.venue, city: event.city, description: event.description,
        image: event.image, status: event.status
      });
    }
  }, [event]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function submit(eventObject) {
    eventObject.preventDefault();
    const validation = validateEvent(form);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;
    setSaving(true);
    setRequestError('');
    try {
      if (isEdit) await updateEvent(id, form);
      else await createEvent(form);
      navigate('/admin/eventos');
    } catch (requestErrorObject) {
      setRequestError(requestErrorObject.message);
    } finally {
      setSaving(false);
    }
  }

  if (status === 'loading') return <StateMessage title="Cargando evento..." />;
  if (status === 'error') return <StateMessage tone="error" title="No se pudo cargar el evento">{error}</StateMessage>;

  return (
    <div>
      <PageHeader eyebrow="Eventos" title={isEdit ? 'Editar evento' : 'Nuevo evento'} description="Los cambios se guardan en el almacenamiento local." />
      <form className="admin-form" onSubmit={submit} noValidate>
        <FormField label="Título" htmlFor="title" error={errors.title}>
          <input id="title" value={form.title} onChange={(event) => update('title', event.target.value)} />
        </FormField>
        <div className="form-row">
          <FormField label="Categoría" htmlFor="category" error={errors.category}>
            <input id="category" value={form.category} onChange={(event) => update('category', event.target.value)} />
          </FormField>
          <FormField label="Estado" htmlFor="status">
            <select id="status" value={form.status} onChange={(event) => update('status', event.target.value)}>
              <option value="draft">Borrador</option>
              <option value="published">Publicado</option>
              <option value="soldout">Agotado</option>
              <option value="finished">Finalizado</option>
            </select>
          </FormField>
        </div>
        <div className="form-row">
          <FormField label="Fecha" htmlFor="date" error={errors.date}>
            <input id="date" type="date" value={form.date} onChange={(event) => update('date', event.target.value)} />
          </FormField>
          <FormField label="Hora" htmlFor="time" error={errors.time}>
            <input id="time" type="time" value={form.time} onChange={(event) => update('time', event.target.value)} />
          </FormField>
        </div>
        <div className="form-row">
          <FormField label="Lugar" htmlFor="venue" error={errors.venue}>
            <input id="venue" value={form.venue} onChange={(event) => update('venue', event.target.value)} />
          </FormField>
          <FormField label="Ciudad" htmlFor="city" error={errors.city}>
            <input id="city" value={form.city} onChange={(event) => update('city', event.target.value)} />
          </FormField>
        </div>
        <FormField label="Descripción" htmlFor="description">
          <textarea id="description" rows="5" value={form.description} onChange={(event) => update('description', event.target.value)} />
        </FormField>
        <FormField label="Imagen" htmlFor="image" hint="Ruta de una imagen local de la carpeta public/images.">
          <select id="image" value={form.image} onChange={(event) => update('image', event.target.value)}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((number) => (
              <option key={number} value={`/images/event-${number}.svg`}>Imagen {number}</option>
            ))}
          </select>
        </FormField>
        {requestError && <StateMessage tone="error" title="No se pudo guardar">{requestError}</StateMessage>}
        <div className="actions">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin/eventos')}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Guardando...' : 'Guardar evento'}</Button>
        </div>
      </form>
    </div>
  );
}
