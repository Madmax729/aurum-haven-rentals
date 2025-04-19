import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Send, User, MessageSquare } from 'lucide-react';

interface Conversation {
  id: string;
  with_user_id: string;
  with_user_name: string;
  with_user_avatar?: string;
  property_id: string;
  property_title: string;
  last_message: string;
  last_message_time: string;
  unread_count: number;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  is_read: boolean;
}

const Messaging = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please login to view your messages",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    // For now, we'll just show dummy data since the tables don't exist yet
    setLoading(false);

    // Comment out the real implementation temporarily
    /*
    // Load user's conversations
    loadConversations();

    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('messaging_changes')
      .on(
        'postgres_changes',
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `recipient_id=eq.${user.id}`
        },
        (payload) => {
          handleNewMessageReceived(payload.new as any);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
    */
  }, [user]);

  // Commenting out functions that depend on non-existing tables
  /*
  const loadConversations = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          property_id,
          properties:property_id(title),
          participants:conversation_participants(
            user_id,
            profiles:user_id(first_name, last_name, avatar_url)
          )
        `)
        .contains('participant_ids', [user?.id])
        .order('updated_at', { ascending: false });
      
      if (error) throw error;
      
      // Format conversations data
      const formattedConversations = data.map(conv => {
        const otherParticipant = conv.participants.find(p => p.user_id !== user?.id);
        const otherUserProfile = otherParticipant?.profiles;
        
        return {
          id: conv.id,
          with_user_id: otherParticipant?.user_id || '',
          with_user_name: otherUserProfile 
            ? `${otherUserProfile.first_name} ${otherUserProfile.last_name}` 
            : 'Unknown User',
          with_user_avatar: otherUserProfile?.avatar_url,
          property_id: conv.property_id,
          property_title: conv.properties?.title || 'Unknown Property',
          last_message: 'Loading...',
          last_message_time: '',
          unread_count: 0
        };
      });
      
      setConversations(formattedConversations);
      
      // If there are conversations, set the first one active
      if (formattedConversations.length > 0) {
        setActiveConversation(formattedConversations[0]);
      }
    } catch (error: any) {
      console.error('Error loading conversations:', error);
      toast({
        title: "Error",
        description: "Failed to load conversations",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      setMessages(data);
    } catch (error: any) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const markConversationAsRead = async (conversationId: string) => {
    try {
      // Mark all messages as read where the user is the recipient
      await supabase
        .from('messages')
        .update({ is_read: true })
        .eq('conversation_id', conversationId)
        .eq('recipient_id', user?.id)
        .eq('is_read', false);
      
      // Update unread count in conversations list
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversationId 
            ? { ...conv, unread_count: 0 } 
            : conv
        )
      );
    } catch (error) {
      console.error('Error marking conversation as read:', error);
    }
  };

  const handleNewMessageReceived = (newMsg: any) => {
    // Update messages if the active conversation matches
    if (activeConversation?.id === newMsg.conversation_id) {
      setMessages(prev => [...prev, newMsg]);
      markConversationAsRead(newMsg.conversation_id);
    }
    
    // Update conversations list with new message info
    setConversations(prev => 
      prev.map(conv => {
        if (conv.id === newMsg.conversation_id) {
          return {
            ...conv,
            last_message: newMsg.content,
            last_message_time: newMsg.created_at,
            unread_count: activeConversation?.id === newMsg.conversation_id 
              ? 0 
              : conv.unread_count + 1
          };
        }
        return conv;
      })
    );
  };

  const sendMessage = async () => {
    if (!activeConversation || !newMessage.trim()) return;
    
    try {
      const message = {
        conversation_id: activeConversation.id,
        sender_id: user?.id,
        recipient_id: activeConversation.with_user_id,
        content: newMessage,
        is_read: false,
      };
      
      const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single();
      
      if (error) throw error;
      
      setMessages(prev => [...prev, data]);
      setNewMessage('');
      
      // Update conversation's last message
      setConversations(prev => 
        prev.map(conv => {
          if (conv.id === activeConversation.id) {
            return {
              ...conv,
              last_message: newMessage,
              last_message_time: new Date().toISOString()
            };
          }
          return conv;
        })
      );
      
      // Update conversation's updated_at time
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', activeConversation.id);
      
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };
  */

  // Placeholder function for now
  const sendMessage = () => {
    toast({
      title: "Feature Coming Soon",
      description: "Messaging functionality will be available soon!",
    });
    setNewMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // For demo purposes, we'll just show a placeholder
  const showDemoContent = true;

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Inbox</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[600px]">
          <Card className="md:col-span-1 h-full">
            <CardHeader>
              <CardTitle className="text-lg">Conversations</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[520px]">
                {loading ? (
                  <div className="p-4 space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-muted animate-pulse"></div>
                        <div className="space-y-2">
                          <div className="h-4 w-32 bg-muted animate-pulse rounded"></div>
                          <div className="h-3 w-20 bg-muted animate-pulse rounded"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : showDemoContent ? (
                  <div className="p-6 text-center">
                    <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
                    <p className="text-muted-foreground mb-4">
                      When you book a property or someone books yours, 
                      you'll be able to message them here.
                    </p>
                    <Button onClick={() => navigate('/explore')}>
                      Browse Properties
                    </Button>
                  </div>
                ) : (
                  <div>
                    {/* This part would display the actual conversations when implemented */}
                    <div className="p-6 text-center">
                      <p>Your conversations will appear here</p>
                    </div>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2 h-full flex flex-col">
            <div className="flex items-center justify-center h-full">
              <div className="text-center p-6">
                <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-xl font-medium mb-2">Messaging Coming Soon</h3>
                <p className="text-muted-foreground mb-4">
                  The messaging functionality will be available soon. Stay tuned!
                </p>
                <Button onClick={() => navigate('/explore')}>
                  Browse Properties
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Messaging;
