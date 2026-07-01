/* ===========================================
   Volunteer Storage
=========================================== */

export const saveVolunteer = (volunteer) => {
  const volunteers =
    JSON.parse(localStorage.getItem("volunteers")) || [];

  volunteers.push({
    ...volunteer,
    id: Date.now(),
    status: "Pending",
    submittedAt: new Date().toLocaleString(),
  });

  localStorage.setItem(
    "volunteers",
    JSON.stringify(volunteers)
  );
};

/* ===========================================
   Get Volunteers
=========================================== */

export const getVolunteers = () => {
  return (
    JSON.parse(localStorage.getItem("volunteers")) || []
  );
};

/* ===========================================
   Delete Volunteer
=========================================== */

export const deleteVolunteer = (id) => {
  const volunteers =
    JSON.parse(localStorage.getItem("volunteers")) || [];

  const updated = volunteers.filter(
    (item) => item.id !== id
  );

  localStorage.setItem(
    "volunteers",
    JSON.stringify(updated)
  );
};

/* ===========================================
   Clear Volunteers
=========================================== */

export const clearVolunteers = () => {
  localStorage.removeItem("volunteers");
};