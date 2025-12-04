import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { FlatList } from "react-native";
import { Provider as PaperProvider, Appbar, Card, Text, ActivityIndicator, Button } from "react-native-paper";

const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }: any) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://jsonplaceholder.typicode.com/posts");
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError("Erro ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Appbar.Header>
          <Appbar.Content title="Posts" />
        </Appbar.Header>
        <ActivityIndicator style={{ marginTop: 50 }} />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Appbar.Header>
          <Appbar.Content title="Posts" />
        </Appbar.Header>
        <Text style={{ margin: 20, color: "red" }}>{error}</Text>
        <Button mode="contained" onPress={fetchData} style={{ marginHorizontal: 20 }}>
          Tentar novamente
        </Button>
      </>
    );
  }

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Posts" />
      </Appbar.Header>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={{ margin: 10 }} onPress={() => navigation.navigate("Details", { post: item })}>
            <Card.Title title={item.title} />
            <Card.Content>
              <Text numberOfLines={2}>{item.body}</Text>
            </Card.Content>
          </Card>
        )}
      />
    </>
  );
}

function DetailsScreen({ route }: any) {
  const { post } = route.params;

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Detalhes" />
      </Appbar.Header>
      <Card style={{ margin: 20 }}>
        <Card.Title title={post.title} />
        <Card.Content>
          <Text>{post.body}</Text>
        </Card.Content>
      </Card>
    </>
  );
}

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
