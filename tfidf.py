import nltk
import numpy as np

def term_frequency(document: list, normalize: bool = True) -> tuple[np.array, np.array]:
    """This function calculates the term frequency of a document.
    The term frequency is normalized by the total number of words in the document.
    Returns a tuple of arrays. The first array is the terms and the second array is
    the term frequency in the same order.
    
    Arguments:
        document (list): array of tokens.
    """
    fdist = nltk.FreqDist(document)
    n_words = fdist.N()
    terms = np.array(list(fdist.keys()))
    tf = np.array(list(fdist.values()))
    
    if normalize:
        tf = tf / n_words
    
    return tf, terms


def inverse_document_frequency(documents: dict[list], corpus=None) -> dict[float]:
    """This function computes a lookup table (dictionary) of
    the inverse document frequency (idf) for all terms in a given
    dictionary of documents.
    """
    if corpus is None:
        corpus = documents.keys()
    
    n_documents = len(corpus)
    terms, counts = np.unique(
        np.concatenate([list(set(documents[d])) for d in corpus]),
        return_counts=True
    )
    
    idf = np.log(n_documents / (counts))
    idf_lookup = {term: w for term, w in zip(terms, idf)}
    
    return idf_lookup

def tf_idf(document: list, idf_lookup: dict[float], return_tf: bool = False) -> tuple[np.array, np.array]:
    """Computes the tf-idf of a document, given a document and a lookup table for idf."""
    tf, terms = term_frequency(document)
    idf = np.array([idf_lookup[term] for term in terms])
    
    if return_tf:
        return tf * idf, terms, tf
    else:
        return tf * idf, terms    