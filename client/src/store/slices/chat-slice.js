export const createChatSlice = (set,get) => ({
    selectedChatType : undefined,
    selectedChatData : undefined,
    selectedMessages : [],
    setSelectedChatType : (selectedChatType) => set({selectedChatType}),
    setSelectedChatData : (selectedChatData) => set({selectedChatData}),
    setSelectedMessages: (selectedMessages) => set({selectedMessages}),
    closeChat : () => set({selectedChatType : undefined, selectedChatData : undefined , selectedMessages : []})
    
})