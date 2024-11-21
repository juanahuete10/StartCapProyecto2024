import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import { db, auth } from '../../firebase/firebaseconfig';
import { collection, doc, getDoc, query, orderBy, onSnapshot, addDoc, serverTimestamp, setDoc } from 'firebase/firestore';

const Chat = ({ route }) => {
  const usuario = auth.currentUser;
  const id_inversionista = usuario?.uid; // Obtener el ID del inversionista desde auth
  const id_emprendedor = route.params?.id_emprendedor; // Asegurarse de que 'route' tenga los parámetros correctamente

  const [roles, setRoles] = useState({ emprendedor: null, inversionista: null });
  const [messages, setMessages] = useState([]);

  console.log("Route Params - id_emprendedor:", id_emprendedor, "id_inversionista:", id_inversionista);

  // Función para obtener el rol del usuario
  const getUserRole = async (id_usuario) => {
    try {
      const userRef = doc(db, 'usuarios', id_usuario);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data().rol; // Suponiendo que el campo de rol se llama 'rol'
      } else {
        console.error("No se encontró el usuario en la base de datos");
        return null;
      }
    } catch (error) {
      console.error("Error al obtener el rol del usuario:", error);
      return null;
    }
  };

  // Función para crear una notificación
  const crearNotificacion = async (mensaje) => {
    try {
      await addDoc(collection(db, 'Notificacion'), {
        Contenido: mensaje,
        tipo: 'mensaje',
        estado: 'recibidas',
        fecha: new Date(),
        id_inversionista,
        id_emprendedor,
      });
    } catch (error) {
      console.error("Error al crear la notificación: ", error);
    }
  };

  // Función para obtener o crear el chatId basado en los IDs de los usuarios
  const getOrCreateChatId = async () => {
    if (!id_emprendedor || !id_inversionista) {
      console.error("Uno de los IDs es indefinido:", id_emprendedor, id_inversionista);
      return null;
    }
    const ids = [id_emprendedor, id_inversionista].sort(); // Usar los ID correctamente
    const potencialChatId = `${ids[0]}_${ids[1]}`;
    const chatRef = doc(db, 'chat', potencialChatId);
    const chatSnap = await getDoc(chatRef);
    if (!chatSnap.exists()) {
      // Si el chat no existe, lo creamos
      const rolEmprendedor = await getUserRole(id_emprendedor);
      const rolInversionista = await getUserRole(id_inversionista);
      await setDoc(chatRef, {
        id_inversionista: rolEmprendedor === 'inversionista' ? id_inversionista : id_emprendedor,
        id_emprendedor: rolInversionista === 'emprendedor' ? id_emprendedor : id_inversionista,
      });
    }
    return potencialChatId;
  };

  // Obtener el rol del usuario actual (emprendedor) y el inversionista cuando se monta el componente
  useEffect(() => {
    if (id_emprendedor && id_inversionista) {
      const fetchRoles = async () => {
        const rolEmprendedor = await getUserRole(id_emprendedor);
        const rolInversionista = await getUserRole(id_inversionista);
        setRoles({ emprendedor: rolEmprendedor, inversionista: rolInversionista });
      };
      fetchRoles();
    }
  }, [id_emprendedor, id_inversionista]);

  // Obtener los mensajes del chat
  useEffect(() => {
    if (id_emprendedor && id_inversionista) {
      getOrCreateChatId().then((id_chat) => {
        if (!id_chat) return;
        const q = query(collection(db, 'chat', id_chat, 'contenido'), orderBy('fecha', 'desc'));
        const cancelarSuscripcion = onSnapshot(q, (snapshot) => {
          setMessages(
            snapshot.docs.map((doc) => ({
              _id: doc.id,
              text: doc.data().contenido,
              createdAt: doc.data().fecha ? doc.data().fecha.toDate() : new Date(),
              user: {
                _id: doc.data().id_usuario,
                name: "Nombre del Usuario", // Ajustar para obtener el nombre real si es necesario
              },
            }))
          );
        });
        return () => cancelarSuscripcion();
      });
    }
  }, [id_emprendedor, id_inversionista]);

  // Función para enviar un mensaje
  const onSend = useCallback((messages = []) => {
    getOrCreateChatId().then((id_chat) => {
      if (!id_chat) return;
      messages.forEach(async (message) => {
        await addDoc(collection(db, 'chat', id_chat, 'contenido'), {
          contenido: message.text,
          fecha: serverTimestamp(),
          id_usuario: id_emprendedor, // Usar el UID del usuario actual
          estado: 'No leído',
        });

        // Crear la notificación después de enviar el mensaje
        let mensajeNotificacion = '';
        if (roles.emprendedor) {
          mensajeNotificacion = `Nuevo mensaje de Emprendedor ${id_emprendedor}`;
        } else if (roles.inversionista) {
          mensajeNotificacion = `Nuevo mensaje de Inversionista ${id_inversionista}`;
        }

        // Crear la notificación para el mensaje enviado
        await crearNotificacion(mensajeNotificacion);
      });
    });
  }, [id_emprendedor, roles]);

  return (
    <GiftedChat
      messages={messages}
      onSend={(messages) => onSend(messages)}
      user={{
        _id: id_emprendedor, // El UID del usuario actual
      }}
    />
  );
};

export default Chat;
