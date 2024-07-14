export const createChatSlice = (get,set) => ({
    selectedChatType : undefined,
    selectedChatData : undefined,
    setSelectedChatType : (selectedChatType) => set({selectedChatType}),
    setSelectedChatData : (selectedChatData) => set({selectedChatData}),
    
})