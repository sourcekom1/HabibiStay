import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { testRunner, type TestSuite, type TestResult } from "@/lib/testSuite";
import { Play, CheckCircle, XCircle, Clock, Activity } from "lucide-react";

export default function TestDashboard() {
  const [testResults, setTestResults] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);

  const runTests = async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      const results = await testRunner.runAllTests();
      setTestResults(results);
      setProgress(100);
    } catch (error) {
      console.error('Test execution failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const totalTests = testResults.reduce((sum, suite) => sum + suite.tests.length, 0);
  const passedTests = testResults.reduce((sum, suite) => 
    sum + suite.tests.filter(test => test.passed).length, 0);
  const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 200);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="glass-card p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Test Dashboard</h1>
              <p className="text-gray-600">Comprehensive end-to-end testing suite</p>
            </div>
            <Button
              onClick={runTests}
              disabled={isRunning}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
            >
              {isRunning ? (
                <>
                  <Activity className="mr-2 h-5 w-5 animate-spin" />
                  Running Tests...
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Run All Tests
                </>
              )}
            </Button>
          </div>

          {isRunning && (
            <div className="mt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Testing Progress</span>
                <span className="text-sm text-gray-500">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2 bg-white/30" />
            </div>
          )}
        </div>

        {testResults.length > 0 && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <CheckCircle className="h-8 w-8 text-green-500 mr-4" />
                    <div>
                      <p className="text-2xl font-bold">{passedTests}</p>
                      <p className="text-sm text-gray-600">Passed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <XCircle className="h-8 w-8 text-red-500 mr-4" />
                    <div>
                      <p className="text-2xl font-bold">{totalTests - passedTests}</p>
                      <p className="text-sm text-gray-600">Failed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Activity className="h-8 w-8 text-blue-500 mr-4" />
                    <div>
                      <p className="text-2xl font-bold">{totalTests}</p>
                      <p className="text-sm text-gray-600">Total Tests</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Clock className="h-8 w-8 text-purple-500 mr-4" />
                    <div>
                      <p className="text-2xl font-bold">{successRate}%</p>
                      <p className="text-sm text-gray-600">Success Rate</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Test Suites */}
            <div className="space-y-6">
              {testResults.map((suite, index) => (
                <Card key={index} className="glass-card">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          {suite.passed ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500 mr-2" />
                          )}
                          {suite.name}
                        </CardTitle>
                        <CardDescription>
                          {suite.tests.filter(t => t.passed).length}/{suite.tests.length} tests passed
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={suite.passed ? "default" : "destructive"}>
                          {suite.passed ? "PASSED" : "FAILED"}
                        </Badge>
                        <Badge variant="outline">
                          {suite.totalDuration}ms
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {suite.tests.map((test, testIndex) => (
                        <div
                          key={testIndex}
                          className={`flex items-center justify-between p-3 rounded-lg transition-all duration-200 ${
                            test.passed 
                              ? "bg-green-50/80 backdrop-blur-sm border border-green-200" 
                              : "bg-red-50/80 backdrop-blur-sm border border-red-200"
                          }`}
                        >
                          <div className="flex items-center">
                            {test.passed ? (
                              <CheckCircle className="h-4 w-4 text-green-500 mr-3" />
                            ) : (
                              <XCircle className="h-4 w-4 text-red-500 mr-3" />
                            )}
                            <span className="font-medium">{test.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant="outline" className="text-xs">
                              {test.duration}ms
                            </Badge>
                            {!test.passed && (
                              <Badge variant="destructive" className="text-xs">
                                {test.message}
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}