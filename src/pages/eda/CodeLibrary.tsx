import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Code, Clock, User, Eye } from 'lucide-react';

interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  language: 'verilog' | 'vhdl' | 'systemverilog';
  author: string;
  views: number;
  createdAt: string;
  tags: string[];
}

const snippets: CodeSnippet[] = [
  {
    id: '1',
    title: 'Simple AND Gate',
    description: 'Basic 2-input AND gate with testbench',
    language: 'verilog',
    author: 'EDA Team',
    views: 1234,
    createdAt: '2024-01-15',
    tags: ['basic', 'combinational', 'gates']
  },
  {
    id: '2',
    title: 'D Flip-Flop',
    description: 'Positive edge-triggered D flip-flop',
    language: 'verilog',
    author: 'EDA Team',
    views: 987,
    createdAt: '2024-01-14',
    tags: ['sequential', 'flip-flop', 'storage']
  },
  {
    id: '3',
    title: '4-bit Counter',
    description: 'Synchronous up counter with reset',
    language: 'verilog',
    author: 'EDA Team',
    views: 856,
    createdAt: '2024-01-13',
    tags: ['sequential', 'counter', 'intermediate']
  },
  {
    id: '4',
    title: 'Full Adder',
    description: '1-bit full adder with carry',
    language: 'verilog',
    author: 'Community',
    views: 745,
    createdAt: '2024-01-12',
    tags: ['arithmetic', 'combinational', 'adder']
  },
  {
    id: '5',
    title: 'Multiplexer 4:1',
    description: '4-to-1 multiplexer with select lines',
    language: 'verilog',
    author: 'Community',
    views: 623,
    createdAt: '2024-01-11',
    tags: ['multiplexer', 'combinational', 'basic']
  },
  {
    id: '6',
    title: 'UART Transmitter',
    description: 'Simple UART transmitter module',
    language: 'verilog',
    author: 'Advanced User',
    views: 512,
    createdAt: '2024-01-10',
    tags: ['communication', 'uart', 'advanced']
  },
  {
    id: '7',
    title: 'ALU 8-bit',
    description: 'Arithmetic Logic Unit with multiple operations',
    language: 'systemverilog',
    author: 'EDA Team',
    views: 1098,
    createdAt: '2024-01-09',
    tags: ['alu', 'arithmetic', 'advanced']
  },
  {
    id: '8',
    title: 'RAM Module',
    description: 'Simple RAM with read/write operations',
    language: 'verilog',
    author: 'Community',
    views: 432,
    createdAt: '2024-01-08',
    tags: ['memory', 'ram', 'storage']
  },
];

export default function CodeLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');

  const filteredSnippets = snippets.filter(snippet => {
    const matchesSearch = snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesLanguage = selectedLanguage === 'all' || snippet.language === selectedLanguage;
    return matchesSearch && matchesLanguage;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/eda" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EDA Playground
              </Link>
              <span className="text-sm text-gray-500">Code Library</span>
            </div>
            
            <Link to="/eda">
              <Button>
                <Code className="w-4 h-4 mr-2" />
                Open Editor
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="mb-8">
          <Card className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Search by title, description, or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={selectedLanguage === 'all' ? 'default' : 'outline'}
                  onClick={() => setSelectedLanguage('all')}
                >
                  All
                </Button>
                <Button
                  variant={selectedLanguage === 'verilog' ? 'default' : 'outline'}
                  onClick={() => setSelectedLanguage('verilog')}
                >
                  Verilog
                </Button>
                <Button
                  variant={selectedLanguage === 'vhdl' ? 'default' : 'outline'}
                  onClick={() => setSelectedLanguage('vhdl')}
                >
                  VHDL
                </Button>
                <Button
                  variant={selectedLanguage === 'systemverilog' ? 'default' : 'outline'}
                  onClick={() => setSelectedLanguage('systemverilog')}
                >
                  SystemVerilog
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredSnippets.length} of {snippets.length} snippets
          </p>
        </div>

        {/* Snippets Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSnippets.map((snippet) => (
            <Card key={snippet.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold">{snippet.title}</h3>
                  <Badge variant="secondary" className="ml-2">
                    {snippet.language}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {snippet.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {snippet.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{snippet.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{snippet.views}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{snippet.createdAt}</span>
                  </div>
                </div>

                <Link to={`/eda?snippet=${snippet.id}`}>
                  <Button className="w-full" size="sm">
                    <Code className="w-4 h-4 mr-2" />
                    Open in Editor
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {filteredSnippets.length === 0 && (
          <div className="text-center py-12">
            <Code className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold mb-2">No snippets found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
