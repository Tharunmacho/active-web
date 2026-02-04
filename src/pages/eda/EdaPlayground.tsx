import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Play, Save, Upload, Download, Share2, FileText, Settings } from 'lucide-react';
import { toast } from 'sonner';

// Default code templates
const DEFAULT_VERILOG = `// Simple AND Gate Example
module and_gate (
    input wire a,
    input wire b,
    output wire y
);
    assign y = a & b;
endmodule

// Testbench
module tb_and_gate;
    reg a, b;
    wire y;
    
    and_gate uut (
        .a(a),
        .b(b),
        .y(y)
    );
    
    initial begin
        $dumpfile("dump.vcd");
        $dumpvars(0, tb_and_gate);
        
        a = 0; b = 0; #10;
        a = 0; b = 1; #10;
        a = 1; b = 0; #10;
        a = 1; b = 1; #10;
        
        $finish;
    end
endmodule
`;

const DEFAULT_VHDL = `-- Simple AND Gate Example
library IEEE;
use IEEE.STD_LOGIC_1164.ALL;

entity and_gate is
    Port ( a : in  STD_LOGIC;
           b : in  STD_LOGIC;
           y : out STD_LOGIC);
end and_gate;

architecture Behavioral of and_gate is
begin
    y <= a and b;
end Behavioral;
`;

export default function EdaPlayground() {
  const [code, setCode] = useState(DEFAULT_VERILOG);
  const [language, setLanguage] = useState<'verilog' | 'vhdl' | 'systemverilog'>('verilog');
  const [simulator, setSimulator] = useState('icarus');
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage as 'verilog' | 'vhdl' | 'systemverilog');
    if (newLanguage === 'verilog' || newLanguage === 'systemverilog') {
      setCode(DEFAULT_VERILOG);
    } else if (newLanguage === 'vhdl') {
      setCode(DEFAULT_VHDL);
    }
  };

  const handleRun = async () => {
    setIsRunning(true);
    setOutput('Compiling and simulating...\n');
    
    try {
      // Simulate compilation and execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const simulationOutput = `
=== Compilation Successful ===
Compiling ${language === 'vhdl' ? 'VHDL' : 'Verilog'} code with ${simulator}...
Compilation completed successfully.

=== Simulation Started ===
VCD info: dumpfile dump.vcd opened for output.
Time: 0  a=0 b=0 y=0
Time: 10 a=0 b=1 y=0
Time: 20 a=1 b=0 y=0
Time: 30 a=1 b=1 y=1

=== Simulation Completed ===
Simulation finished at time 40
`;
      
      setOutput(simulationOutput);
      toast.success('Simulation completed successfully!');
    } catch (error) {
      setOutput('Error: Simulation failed. Please check your code.\n');
      toast.error('Simulation failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSave = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design.${language === 'vhdl' ? 'vhd' : 'v'}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded successfully!');
  };

  const handleShare = () => {
    // Generate a shareable link (in a real implementation, this would save to a database)
    const shareId = Math.random().toString(36).substr(2, 9);
    const shareUrl = `${window.location.origin}/eda/share/${shareId}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Share link copied to clipboard!');
  };

  const handleLoadFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        toast.success('File loaded successfully!');
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                EDA Playground
              </h1>
              <span className="text-sm text-gray-500">Online HDL Editor & Simulator</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => document.getElementById('file-upload')?.click()}>
                <Upload className="w-4 h-4 mr-2" />
                Load
              </Button>
              <input
                id="file-upload"
                type="file"
                accept=".v,.vh,.sv,.vhd,.vhdl"
                className="hidden"
                onChange={handleLoadFile}
              />
              <Button variant="outline" size="sm" onClick={handleSave}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm" onClick={handleShare}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Settings */}
          <div className="lg:col-span-1">
            <Card className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  Configuration
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Language</label>
                    <Select value={language} onValueChange={handleLanguageChange}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="verilog">Verilog</SelectItem>
                        <SelectItem value="systemverilog">SystemVerilog</SelectItem>
                        <SelectItem value="vhdl">VHDL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block">Simulator</label>
                    <Select value={simulator} onValueChange={setSimulator}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="icarus">Icarus Verilog</SelectItem>
                        <SelectItem value="modelsim">ModelSim</SelectItem>
                        <SelectItem value="ghdl">GHDL (VHDL)</SelectItem>
                        <SelectItem value="verilator">Verilator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button 
                    className="w-full" 
                    onClick={handleRun}
                    disabled={isRunning}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {isRunning ? 'Running...' : 'Run Simulation'}
                  </Button>
                </div>
              </div>

              {/* Code Templates */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Templates
                </h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-sm"
                    onClick={() => setCode(DEFAULT_VERILOG)}
                  >
                    AND Gate
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-sm"
                    onClick={() => setCode(`// D Flip-Flop\nmodule dff (\n    input wire clk,\n    input wire d,\n    output reg q\n);\n    always @(posedge clk) begin\n        q <= d;\n    end\nendmodule`)}
                  >
                    D Flip-Flop
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-sm"
                    onClick={() => setCode(`// Counter\nmodule counter (\n    input wire clk,\n    input wire rst,\n    output reg [3:0] count\n);\n    always @(posedge clk or posedge rst) begin\n        if (rst)\n            count <= 4'b0000;\n        else\n            count <= count + 1;\n    end\nendmodule`)}
                  >
                    Counter
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <Tabs defaultValue="editor" className="w-full">
                <div className="border-b border-gray-200 px-4">
                  <TabsList className="bg-transparent">
                    <TabsTrigger value="editor">Editor</TabsTrigger>
                    <TabsTrigger value="console">Console</TabsTrigger>
                    <TabsTrigger value="waveform">Waveform Viewer</TabsTrigger>
                  </TabsList>
                </div>

                <TabsContent value="editor" className="m-0 p-0">
                  <div className="h-[600px]">
                    <Editor
                      height="100%"
                      defaultLanguage={language === 'vhdl' ? 'vhdl' : 'verilog'}
                      language={language === 'vhdl' ? 'vhdl' : 'verilog'}
                      value={code}
                      onChange={(value) => setCode(value || '')}
                      onMount={handleEditorDidMount}
                      theme="vs-dark"
                      options={{
                        minimap: { enabled: true },
                        fontSize: 14,
                        lineNumbers: 'on',
                        scrollBeyondLastLine: false,
                        automaticLayout: true,
                        tabSize: 4,
                        wordWrap: 'on',
                      }}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="console" className="m-0">
                  <div className="h-[600px] bg-gray-900 text-green-400 p-4 overflow-auto font-mono text-sm">
                    <pre className="whitespace-pre-wrap">{output || 'Run simulation to see output...'}</pre>
                  </div>
                </TabsContent>

                <TabsContent value="waveform" className="m-0">
                  <div className="h-[600px] bg-white p-4 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <svg className="w-24 h-24 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-lg font-medium">Waveform Viewer</p>
                      <p className="text-sm mt-2">Run simulation to generate and view waveforms</p>
                      <p className="text-xs mt-1 text-gray-400">VCD file will be visualized here</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
