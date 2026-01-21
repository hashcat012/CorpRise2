const handleCreateCompany = async () => {
  if (!newCompany.name || !newCompany.company_type) {
    toast.error('Şirket adı ve türü gerekli');
    return;
  }
  setCreating(true);
  try {
    const response = await fetch(`${BACKEND_URL}/api/companies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(newCompany)
    });
    const data = await response.json();
    if (response.ok) {
      toast.success('Şirket başarıyla kuruldu!');
      setDialogOpen(false);
      setNewCompany({ name: '', company_type: '' });
      fetchCompanies();
    } else {
      toast.error(data?.message || 'Şirket kurulamadı');
    }
  } catch (error) {
    toast.error('Bir hata oluştu: ' + error.message);
  } finally {
    setCreating(false);
  }
};
