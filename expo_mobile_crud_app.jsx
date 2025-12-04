# Mobile: Expo + React Native + TypeScript

/*
Project structure (single-file representation for the canvas):

/mobile-app
  |-- package.json
  |-- app.json
  |-- tsconfig.json
  |-- App.tsx
  |-- src
      |-- api.ts
      |-- screens
          |-- ListScreen.tsx
          |-- CreateEditScreen.tsx
          |-- DetailsScreen.tsx
      |-- components
          |-- PostItem.tsx
  |-- README.md
  |-- .gitignore
*/

// package.json
{
  "name": "expo-crud-app",
  "version": "1.0.0",
  "main": "node_modules/expo/AppEntry.js",
  "scripts": {
    "start": "expo start",
    "android": "expo start --android",
    "ios": "expo start --ios",
    "web": "expo start --web"
  },
  "dependencies": {
    "expo": "^49.0.0",
    "react": "18.2.0",
    "react-native": "0.72.0",
    "@react-navigation/native": "^6.1.6",
    "@react-navigation/native-stack": "^6.9.12",
    "react-native-gesture-handler": "^2.12.0",
    "react-native-safe-area-context": "^4.5.0",
    "react-native-screens": "^3.22.0"
  },
  "devDependencies": {
    "typescript": "^5.1.6",
    "@types/react": "^18.0.28",
    "@types/react-native": "^0.72.6"
  }
}

// app.json
{
  "expo": {
    "name": "Expo CRUD App",
    "slug": "expo-crud-app",
    "platforms": ["ios", "android", "web"],
    "sdkVersion": "49.0.0"
  }
}

// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "ESNext",
    "jsx": "react-jsx",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}

// src/api.ts
export const API_BASE = process.env.API_BASE || 'http://10.0.2.2:3333' // android emulator uses 10.0.2.2; use localhost for iOS/simulators or your machine IP

export type Post = {
  id: string
  title: string
  body: string
}

export async function fetchPosts() {
  const res = await fetch(`${API_BASE}/posts`)
  if (!res.ok) throw new Error('Network error')
  return res.json() as Promise<Post[]>
}

export async function fetchPost(id: string) {
  const res = await fetch(`${API_BASE}/posts/${id}`)
  if (!res.ok) throw new Error('Network error')
  return res.json() as Promise<Post>
}

export async function createPost(payload: { title: string; body?: string }) {
  const res = await fetch(`${API_BASE}/posts`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error('Network error')
  return res.json() as Promise<Post>
}

export async function updatePost(id: string, payload: { title?: string; body?: string }) {
  const res = await fetch(`${API_BASE}/posts/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
  if (!res.ok) throw new Error('Network error')
  return res.json() as Promise<Post>
}

export async function deletePost(id: string) {
  const res = await fetch(`${API_BASE}/posts/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Network error')
  return res.json() as Promise<Post>
}

// App.tsx
import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import ListScreen from './src/screens/ListScreen'
import CreateEditScreen from './src/screens/CreateEditScreen'
import DetailsScreen from './src/screens/DetailsScreen'

const Stack = createNativeStackNavigator()

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="List" component={ListScreen} options={{ title: 'Posts' }} />
        <Stack.Screen name="CreateEdit" component={CreateEditScreen} options={{ title: 'Criar / Editar' }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ title: 'Detalhes' }} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

// src/screens/ListScreen.tsx
import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import { fetchPosts } from '../api'

export default function ListScreen({ navigation }: any) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    try {
      setLoading(true)
      const posts = await fetchPosts()
      setData(posts)
    } catch (err) {
      Alert.alert('Erro', 'Não foi possível carregar')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const unsub = navigation.addListener('focus', () => {
      load()
    })
    return unsub
  }, [navigation])

  if (loading) return <ActivityIndicator style={{ marginTop: 50 }} />

  return (
    <View style={{ flex: 1, padding: 12 }}>
      <TouchableOpacity onPress={() => navigation.navigate('CreateEdit')} style={{ marginBottom: 12 }}>
        <Text style={{ fontSize: 16, color: 'blue' }}>+ Criar novo</Text>
      </TouchableOpacity>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('Details', { id: item.id })} style={{ padding: 12, borderWidth: 1, borderColor: '#ddd', marginBottom: 8, borderRadius: 8 }}>
            <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
            <Text numberOfLines={2}>{item.body}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

// src/screens/CreateEditScreen.tsx
import React, { useEffect, useState } from 'react'
import { View, TextInput, Button, Alert } from 'react-native'
import { createPost, fetchPost, updatePost } from '../api'

export default function CreateEditScreen({ route, navigation }: any) {
  const id = route.params?.id
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (id) {
      ;(async () => {
        try {
          setLoading(true)
          const p = await fetchPost(id)
          setTitle(p.title)
          setBody(p.body)
        } catch (err) {
          Alert.alert('Erro')
        } finally {
          setLoading(false)
        }
      })()
    }
  }, [id])

  const save = async () => {
    if (!title) return Alert.alert('Título obrigatório')
    try {
      setLoading(true)
      if (id) {
        await updatePost(id, { title, body })
      } else {
        await createPost({ title, body })
      }
      navigation.goBack()
    } catch (err) {
      Alert.alert('Erro ao salvar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={{ padding: 12 }}>
      <TextInput placeholder="Título" value={title} onChangeText={setTitle} style={{ borderWidth: 1, borderColor: '#ddd', marginBottom: 12, padding: 8 }} />
      <TextInput placeholder="Corpo" value={body} onChangeText={setBody} multiline numberOfLines={4} style={{ borderWidth: 1, borderColor: '#ddd', marginBottom: 12, padding: 8, height: 120 }} />
      <Button title={id ? 'Atualizar' : 'Criar'} onPress={save} disabled={loading} />
    </View>
  )
}

// src/screens/DetailsScreen.tsx
import React, { useEffect, useState } from 'react'
import { View, Text, Button, Alert } from 'react-native'
import { fetchPost, deletePost } from '../api'

export default function DetailsScreen({ route, navigation }: any) {
  const id = route.params.id
  const [post, setPost] = useState<any | null>(null)

  useEffect(() => {
    ;(async () => {
      try {
        const p = await fetchPost(id)
        setPost(p)
      } catch (err) {
        Alert.alert('Erro')
      }
    })()
  }, [id])

  const doDelete = () => {
    Alert.alert('Confirmar', 'Deletar este post?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Deletar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePost(id)
            navigation.navigate('List')
          } catch (err) {
            Alert.alert('Erro ao deletar')
          }
        }
      }
    ])
  }

  if (!post) return null

  return (
    <View style={{ padding: 12 }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>{post.title}</Text>
      <Text style={{ marginBottom: 12 }}>{post.body}</Text>

      <Button title="Editar" onPress={() => navigation.navigate('CreateEdit', { id })} />
      <View style={{ height: 12 }} />
      <Button title="Deletar" color="red" onPress={doDelete} />
    </View>
  )
}

// .gitignore
node_modules
.expo

// README.md
# Expo CRUD Mobile App

App Expo em TypeScript que consome o backend de CRUD (Node + Express) para criar, listar, editar e deletar posts.

## Configuração rápida
- Edite `src/api.ts` e defina `API_BASE` apontando para seu backend (ex: `http://192.168.0.5:3333`)
- `npm install` && `npm start`

*/
