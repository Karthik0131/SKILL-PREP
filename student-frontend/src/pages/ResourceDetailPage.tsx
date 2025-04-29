
import { useState, useEffect } from "react";
import { useParams, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Youtube, FileText, ExternalLink, ChevronLeft } from "lucide-react";
import resourcesData from "@/data/resourcesData";
import { useResourceProgress } from "@/hooks/useResourceProgress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ResourceSidebar from "@/components/ResourceSidebar";

const ResourceDetailPage = () => {
  const { categoryId, subtopicId } = useParams<{ categoryId: string; subtopicId: string }>();
  const { isCompleted, toggleCompletion } = useResourceProgress();
  
  const [activeResource, setActiveResource] = useState(0);

  const category = resourcesData.find((c) => c.id === categoryId);
  const subtopic = category?.subtopics.find((s) => s.id === subtopicId);

  useEffect(() => {
    // Reset active resource when subtopic changes
    setActiveResource(0);
  }, [subtopicId]);

  if (!category || !subtopic) {
    return <Navigate to="/resources" replace />;
  }

  const resource = subtopic.resources[activeResource];
  const resourceKey = `${categoryId}-${subtopicId}-${resource.id}`;
  const isResourceCompleted = isCompleted(resourceKey);

  const handleToggleCompletion = () => {
    toggleCompletion(resourceKey);
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="flex h-full">
      <ResourceSidebar categoryId={categoryId} subtopicId={subtopicId} />
      
      <div className="flex-1 p-6 overflow-auto">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
            asChild
          >
            <Link to={`/resources/${categoryId}`}>
              <ChevronLeft className="h-4 w-4" />
              <span>Back to {category.title}</span>
            </Link>
          </Button>
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeIn}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">{resource.title}</h1>
              <p className="text-muted-foreground">{resource.description}</p>
            </div>
            <Button
              variant={isResourceCompleted ? "outline" : "default"}
              className={`flex items-center gap-2 ${isResourceCompleted ? "border-green-500 text-green-600" : ""}`}
              onClick={handleToggleCompletion}
            >
              {isResourceCompleted ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Completed
                </>
              ) : (
                "Mark as Complete"
              )}
            </Button>
          </div>

          {subtopic.resources.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {subtopic.resources.map((res, index) => {
                const resKey = `${categoryId}-${subtopicId}-${res.id}`;
                const isResCompleted = isCompleted(resKey);
                
                return (
                  <Badge
                    key={res.id}
                    variant={activeResource === index ? "default" : "outline"}
                    className="cursor-pointer py-1 px-3"
                    onClick={() => setActiveResource(index)}
                  >
                    {res.title}
                    {isResCompleted && (
                      <CheckCircle className="h-3 w-3 ml-1 text-green-500" />
                    )}
                  </Badge>
                );
              })}
            </div>
          )}

          <motion.div
            key={resource.id}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className="bg-card border rounded-lg p-6"
          >
            {resource.keyPoints && resource.keyPoints.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Key Points</h2>
                <ul className="list-disc pl-5 space-y-2">
                  {resource.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}

            {resource.content && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Content</h2>
                <div className="prose max-w-none">
                  {resource.content.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-4">{paragraph}</p>
                  ))}
                </div>
              </div>
            )}

            {resource.videoUrl && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <Youtube className="h-5 w-5 text-red-500" />
                  Video Tutorial
                </h2>
                <div className="aspect-video">
                  <iframe
                    className="w-full h-full rounded-lg"
                    src={resource.videoUrl}
                    title={resource.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}

            {resource.pdfUrl && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-500" />
                  PDF Resource
                </h2>
                <Button asChild variant="outline">
                  <a href={resource.pdfUrl} target="_blank" rel="noopener noreferrer">
                    Download PDF
                  </a>
                </Button>
              </div>
            )}

            {resource.practiceQuestions && resource.practiceQuestions.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Practice Questions</h2>
                <div className="space-y-4">
                  {resource.practiceQuestions.map((question, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="font-medium mb-2">Q{index + 1}: {question.question}</p>
                      {question.answer && (
                        <p className="text-muted-foreground">
                          <span className="font-medium">Answer:</span> {question.answer}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resource.companyQuestions && resource.companyQuestions.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-3">Company-specific Questions</h2>
                <div className="space-y-4">
                  {resource.companyQuestions.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <p className="font-medium mb-1">{item.company}</p>
                      {item.questions && item.questions.length > 0 && (
                        <div className="space-y-2">
                          {item.questions.map((q, qIndex) => (
                            <p key={qIndex} className="mb-2">{q}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resource.additionalLinks && resource.additionalLinks.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-purple-500" />
                  Additional Resources
                </h2>
                <ul className="space-y-2">
                  {resource.additionalLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline flex items-center gap-2"
                      >
                        {link.title}
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default ResourceDetailPage;
