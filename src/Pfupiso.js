// Import necessary modules
import React, { useState } from 'react';
import { View, TextInput, Button, Text, ScrollView } from 'react-native';
import { NlpManager } from 'node-nlp';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Initialize NLP manager
const manager = new NlpManager({ languages: ['en'] });

// Define PfupisoScreen component
const PfupisoScreen = () => {
  const [inputText, setInputText] = useState('');
  const [summarizedText, setSummarizedText] = useState('');

  // Function to summarize text
  const summarizeText = async () => {
    // Load trained model if available
    try {
      const model = await AsyncStorage.getItem('nlpModel');
      if (model !== null) {
        manager.load(model);
      }
    } catch (error) {
      console.error('Error loading model:', error);
    }

    // Train the model if not already trained
    if (!manager.trained) {
      // Train the model with sample text
      manager.addDocument('en', inputText);
      await manager.train();
      // Save the trained model
      await AsyncStorage.setItem('nlpModel', manager.save());
    }

    // Get summarized text
    const response = await manager.process('en', inputText);
    const summary = response.answers[0].answer || 'No summary available';
    setSummarizedText(summary);
  };

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View style={{ flex: 1, padding: 20 }}>
        <TextInput
          placeholder="Enter text to summarize"
          multiline
          style={{ height: 150, borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 20 }}
          value={inputText}
          onChangeText={setInputText}
        />
        <Button title="Summarize" onPress={summarizeText} />
        <Text style={{ marginTop: 20 }}>Summarized Text:</Text>
        <Text style={{ borderWidth: 1, borderColor: '#ccc', padding: 10, marginTop: 10 }}>{summarizedText}</Text>
      </View>
    </ScrollView>
  );
};

export default PfupisoScreen;
