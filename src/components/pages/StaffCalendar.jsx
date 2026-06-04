import React, { useState, useEffect, useRef } from "react";
import { doc, getDoc, setDoc, deleteDoc, collection, onSnapshot } from "firebase/firestore";
// Update this import to match the names you exported in your firebase config file
import { dbCalendar, dbNotes } from "../../firebaseConfig"; 

export default function StaffCalendar() {
  const [calendarDays, setCalendarDays] = useState([]);
  const [staffNotes, setStaffNotes] = useState({});
  const [editingDate, setEditingDate] = useState(null);
  const [editValue, setEditValue] = useState("");
  
  const [hoveredRow, setHoveredRow] = useState(null);
  const rowRefs = useRef({});

  useEffect(() => {
    fetchMasterCalendar();
    listenToStaffNotes();
  }, []);

  // Auto-scroll effect to land on the current date
  useEffect(() => {
    if (calendarDays.length > 0) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const todayStr = `${year}-${month}-${day}`;

      const targetDay = calendarDays.find(d => d.fecha >= todayStr);

      if (targetDay && rowRefs.current[targetDay.fecha]) {
        setTimeout(() => {
          rowRefs.current[targetDay.fecha].scrollIntoView({ 
            behavior: "smooth", 
            block: "center" 
          });
        }, 100);
      }
    }
  }, [calendarDays]);

  // READ ONLY: Fetching from the original senorplus project
  const fetchMasterCalendar = async () => {
    try {
      const docRef = doc(dbCalendar, "config", "academic_year_2026_2027");
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const daysArray = data.map || []; 
        setCalendarDays(daysArray);
      }
    } catch (error) {
      console.error("Error fetching master calendar:", error);
    }
  };

  // READ/WRITE: Listening to the new calendar notes project
  const listenToStaffNotes = () => {
    const notesRef = collection(dbNotes, "configNotes");
    onSnapshot(notesRef, (snapshot) => {
      const notesMap = {};
      snapshot.forEach((doc) => {
        notesMap[doc.id] = doc.data().noteText; 
      });
      setStaffNotes(notesMap);
    });
  };

  // READ/WRITE: Saving to the new calendar notes project
  const handleSaveNote = async (dateId) => {
    if (!editValue.trim()) {
      handleDeleteNote(dateId);
      return;
    }
    try {
      const noteRef = doc(dbNotes, "configNotes", dateId);
      await setDoc(noteRef, { noteText: editValue }, { merge: true });
      setEditingDate(null);
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  // READ/WRITE: Deleting from the new calendar notes project
  const handleDeleteNote = async (dateId) => {
    try {
      const noteRef = doc(dbNotes, "configNotes", dateId);
      await deleteDoc(noteRef);
      setEditingDate(null);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const formatStatus = (status) => {
    if (!status) return "";
    if (status === "in-person-pd") return "In-Person PD";
    if (status === "virtual-pd") return "Virtual PD";
    if (status === "no-school") return "No School";
    if (status === "school") return "School";
    if (status === "no-class") return "No Class";
    
    return status.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); 
  };

  const getRowStyle = (status) => {
    if (status === "no-school" || status === "No School") return { backgroundColor: "#fdf3f4", color: "#b02a37" };
    if (status === "in-person-pd" || status === "In-Person PD") return { backgroundColor: "#fff9e6", color: "#664d03" };
    if (status === "virtual-pd" || status === "Virtual PD") return { backgroundColor: "#eef9fd", color: "#055160" };
    return { backgroundColor: "#ffffff", color: "#333" };
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", margin: 0, padding: 0, fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#f0f2f5" }}>
      
      <div style={{ padding: "20px 40px", backgroundColor: "#fff", borderBottom: "1px solid #ddd", boxShadow: "0 2px 4px rgba(0,0,0,0.04)", zIndex: 10 }}>
        <h1 style={{ margin: 0, fontSize: "24px", color: "#1a1a1a" }}>Staff Dashboard: 2026-2027</h1>
      </div>
      
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 40px" }}>
        <div style={{ backgroundColor: "#fff", borderRadius: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", border: "1px solid #e1e4e8" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
            <thead style={{ position: "sticky", top: 0, backgroundColor: "#f8f9fa", borderBottom: "2px solid #dee2e6", zIndex: 5 }}>
              <tr>
                <th style={{ padding: "16px 20px", width: "15%", color: "#495057", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Date</th>
                <th style={{ padding: "16px 20px", width: "15%", color: "#495057", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Cycle/Day</th>
                <th style={{ padding: "16px 20px", width: "20%", color: "#495057", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Status</th>
                <th style={{ padding: "16px 20px", width: "50%", color: "#495057", fontSize: "14px", textTransform: "uppercase", letterSpacing: "0.5px" }}>Daily Notes</th>
              </tr>
            </thead>
            <tbody>
              {calendarDays.map((day, index) => {
                const currentNote = staffNotes[day.fecha] || "";
                const isEditing = editingDate === day.fecha;
                const isHovering = hoveredRow === day.fecha;

                return (
                  <tr 
                    key={index} 
                    ref={(el) => (rowRefs.current[day.fecha] = el)}
                    onMouseEnter={() => setHoveredRow(day.fecha)}
                    onMouseLeave={() => setHoveredRow(null)}
                    style={{ borderBottom: "1px solid #eaecef", transition: "background-color 0.2s ease", ...getRowStyle(day.status) }}
                  >
                    <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>{day.fecha}</td>
                    <td style={{ padding: "16px 20px", fontWeight: "600" }}>
                      {day.ciclo ? `${day.ciclo} - ` : ""} {day.dia ? `Day ${day.dia}` : ""}
                    </td>
                    <td style={{ padding: "16px 20px", fontWeight: "500" }}>
                      {formatStatus(day.status)}
                    </td>
                    
                    <td style={{ padding: "16px 20px" }}>
                      {day.note && (
                        <div style={{ fontWeight: "600", marginBottom: (currentNote || isHovering || isEditing) ? "8px" : "0" }}>
                          {day.note}
                        </div>
                      )}

                      {isEditing ? (
                        <div style={{ display: "flex", gap: "8px" }}>
                          <input 
                            type="text" 
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveNote(day.fecha)}
                            autoFocus
                            style={{ flex: 1, padding: "8px 12px", border: "2px solid #0366d6", borderRadius: "6px", outline: "none", fontSize: "14px" }}
                          />
                          <button onClick={() => handleSaveNote(day.fecha)} style={{ cursor: "pointer", padding: "8px 16px", backgroundColor: "#2ea44f", color: "white", border: "none", borderRadius: "6px", fontWeight: "600" }}>Save</button>
                          <button onClick={() => setEditingDate(null)} style={{ cursor: "pointer", padding: "8px 16px", backgroundColor: "#fafbfc", color: "#24292e", border: "1px solid #d1d5da", borderRadius: "6px", fontWeight: "600" }}>Cancel</button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", minHeight: "32px" }}>
                          {currentNote ? (
                            <>
                              <span style={{ color: "#0366d6", fontStyle: "italic", flex: 1, paddingRight: "10px" }}>{currentNote}</span>
                              {isHovering && (
                                <div style={{ display: "flex", gap: "8px" }}>
                                  <button onClick={() => { setEditingDate(day.fecha); setEditValue(currentNote); }} style={{ cursor: "pointer", padding: "6px 12px", fontSize: "12px", fontWeight: "600", backgroundColor: "#f3f4f6", color: "#24292e", border: "1px solid #d1d5da", borderRadius: "6px" }}>Edit</button>
                                  <button onClick={() => handleDeleteNote(day.fecha)} style={{ cursor: "pointer", padding: "6px 12px", fontSize: "12px", fontWeight: "600", backgroundColor: "#ffeef0", color: "#cb2431", border: "1px solid #ffdce0", borderRadius: "6px" }}>Clear</button>
                                </div>
                              )}
                            </>
                          ) : (
                            <div style={{ width: "100%", height: "100%" }}>
                              {isHovering && (
                                 <button onClick={() => { setEditingDate(day.fecha); setEditValue(""); }} style={{ cursor: "pointer", padding: "6px 12px", backgroundColor: "transparent", border: "1px dashed #d1d5da", color: "#586069", borderRadius: "6px", fontSize: "13px", fontWeight: "600" }}>+ Add Note</button>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}